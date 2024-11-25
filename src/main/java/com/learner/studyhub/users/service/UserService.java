package com.learner.studyhub.users.service;

import com.learner.studyhub.entity.PasswordResetToken;
import com.learner.studyhub.repository.PasswordResetTokenRepository;
import com.learner.studyhub.repository.UserActivityRepository;
import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.entity.UserActivity;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserActivityRepository userActivityRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public String loginUser(UsersDTO usersDTO) {
        UserEntity user = userRepository.findByUserId(usersDTO.getId());
        if (user == null || !passwordEncoder.matches(usersDTO.getPassword(), user.getPassword())) {
            return "로그인 실패";
        }

        // 현재 날짜
        LocalDate today = LocalDate.now();

        // 동일한 유저와 날짜에 대한 기록이 있는지 확인
        Optional<UserActivity> optionalActivity = userActivityRepository.findByUserAndDate(user, today);

        UserActivity activity;
        if (optionalActivity.isPresent()) {
            activity = optionalActivity.get();
            // 기존 기록이 있으면 아무것도 하지 않거나 추가 작업을 할 수 있습니다.
        } else {
            // 없으면 새로운 기록 생성
            activity = new UserActivity();
            activity.setUser(user);
            activity.setDate(today);
            activity.setTotalDuration(0);  // 기본 누적 시간을 0으로 설정
            userActivityRepository.save(activity);
        }

        // 로그인 성공 시 사용자 정보를 반환
        return user.getName() + "|" + user.getNickname() + "|" + user.getEmail();
    }


    public String registerUser(UsersDTO users) {

        boolean isId = userRepository.existsById(users.getId());
        boolean isNickname = userRepository.existsByNickname(users.getNickname());
        boolean isEmail = userRepository.existsByEmail(users.getEmail());
        if (isId) {
            return "아이디 중복";
        }
        if (isNickname) {
            return "닉네임 중복";
        }
        if (isEmail) {
            return "이메일 중복";
        }

        UserEntity data = new UserEntity();

        data.setUserId(users.getId());
        data.setPassword(passwordEncoder.encode(users.getPassword()));
        data.setName(users.getName());
        data.setNickname(users.getNickname());
        data.setEmail(users.getEmail());
        data.setRole("ROLE_USER");

        userRepository.save(data);

        return "success";
    }


    // 회원 정보 조회
    public UsersDTO getUserProfile(String userId) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            UsersDTO userDTO = new UsersDTO();
            userDTO.setId(user.getUserId());
            userDTO.setName(user.getName());
            userDTO.setNickname(user.getNickname());
            userDTO.setEmail(user.getEmail());

            System.out.println("Retrieved user email: " + user.getEmail());
            return userDTO;
        }
        return null;
    }

    // 회원 정보 수정
    // 회원 정보 수정
    public void updateUserProfile(String userId, UsersDTO updatedUserData) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();

            // 필드 업데이트 확인 (email 필드 추가)
            if (updatedUserData.getName() != null && !updatedUserData.getName().isEmpty()) {
                user.setName(updatedUserData.getName());
            } else {
                throw new IllegalArgumentException("Name cannot be null or empty");
            }

            user.setNickname(updatedUserData.getNickname());

            // 이메일 업데이트 추가
            if (updatedUserData.getEmail() != null && !updatedUserData.getEmail().isEmpty()) {
                user.setEmail(updatedUserData.getEmail());
            }

            // 비밀번호가 제공되었으면 암호화 후 저장
            if (updatedUserData.getPassword() != null && !updatedUserData.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updatedUserData.getPassword()));
            }

            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
    }

    public String findIdByEmailAndName(String email, String name) {
        Optional<UserEntity> userOptional = userRepository.findByEmailAndName(email, name);
        return userOptional.map(UserEntity::getUserId).orElse(null);
    }

    public boolean findPasswordByEmailAndUserId(String email, String userId) {
        Optional<UserEntity> userOptional = userRepository.findByEmailAndUserId(email, userId);
        if (userOptional.isPresent()) {
            String token = generateResetToken(email);
            sendPasswordResetEmail(email, token);
            return true;
        }
        return false;
    }

    private String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1)); // 토큰 유효 시간 설정 (예: 1시간)

        tokenRepository.save(resetToken);
        return token;
    }

    private void sendPasswordResetEmail(String email, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        String subject = "비밀번호 재설정 요청";
        String message = "<p>비밀번호를 재설정하려면 아래 링크를 클릭하세요:</p>" +
                "<p><a href=\"" + resetLink + "\">비밀번호 재설정</a></p>";

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(message, true); // HTML 포맷 설정
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("이메일 전송에 실패했습니다: " + e.getMessage());
            throw new IllegalStateException("이메일 전송 중 오류가 발생했습니다.", e);
        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
