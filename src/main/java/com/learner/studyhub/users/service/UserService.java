package com.learner.studyhub.users.service;

import com.learner.studyhub.repository.UserActivityRepository;
import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.entity.UserActivity;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserActivityRepository userActivityRepository;

    @Transactional
    public String loginUser(UsersDTO usersDTO){
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
        boolean isPhone = userRepository.existsByPhone(users.getPhone());
        if (isId){
            return "아이디 중복";
        }
        if (isNickname){
            return "닉네임 중복";
        }
        if (isEmail){
            return "이메일 중복";
        }
        if (isPhone){
            return "휴대폰번호 중복";
        }

        UserEntity data = new UserEntity();

        data.setUserId(users.getId());
        data.setPassword(passwordEncoder.encode(users.getPassword()));
        data.setName(users.getName());
        data.setNickname(users.getNickname());
        data.setPhone(users.getPhone());
        data.setEmail(users.getEmail());
        data.setBirthDate(users.getBirthDate());
        data.setGender(users.getGender());
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
            userDTO.setPhone(user.getPhone());
            userDTO.setGender(user.getGender());
            userDTO.setBirthDate(user.getBirthDate());

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
            user.setPhone(updatedUserData.getPhone());
            user.setGender(updatedUserData.getGender());
            user.setBirthDate(updatedUserData.getBirthDate());

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



}
