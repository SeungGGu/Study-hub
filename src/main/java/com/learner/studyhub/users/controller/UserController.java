package com.learner.studyhub.users.controller;

import com.learner.studyhub.entity.PasswordResetToken;
import com.learner.studyhub.repository.PasswordResetTokenRepository;
import com.learner.studyhub.repository.UserRepository;
import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@ResponseBody
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/loginProc")
    public ResponseEntity<String> loginUser(@RequestBody UsersDTO usersDTO) {
        try {
            // 로그인 처리 및 사용자 정보 반환
            String loginResult = userService.loginUser(usersDTO);

            if (loginResult.equals("로그인 실패")) {
                return ResponseEntity.status(401).body("로그인 실패");
            }

            // 로그인 성공 시 사용자 정보를 반환
            return ResponseEntity.ok(loginResult);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("로그인 중 오류가 발생했습니다.");
        }
    }


    @PostMapping("/register")
    public String registerUser(@RequestBody UsersDTO userData) {
        // Process the form data here
        System.out.println("Received form data: " + userData.toString());
        // Return a response message if needed

        return userService.registerUser(userData);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUserProfile(@PathVariable String userId, @RequestBody UsersDTO updatedUserData) {
        try {
            System.out.println("Update request received for userId: " + userId);
            userService.updateUserProfile(userId, updatedUserData);
            return ResponseEntity.ok("회원 정보가 성공적으로 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            System.out.println("User not found: " + userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UsersDTO> getUserProfile(@PathVariable String userId) {
        UsersDTO userDTO = userService.getUserProfile(userId);
        if (userDTO != null) {
            System.out.println("User email: " + userDTO.getEmail());  // 이메일 값 확인
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(404).body(null); // User not found
        }
    }

    @PostMapping("/find-id")
    public ResponseEntity<Map<String, String>> findId(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");

        String accountId = userService.findIdByEmailAndName(email, name);

        Map<String, String> response = new HashMap<>();
        if (accountId != null) {
            response.put("status", "success");
            response.put("accountId", accountId);
        } else {
            response.put("status", "fail");
            response.put("message", "해당 이메일과 이름으로 등록된 계정을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/find-password")
    public ResponseEntity<Map<String, String>> findPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String userId = request.get("userId");

        boolean isPasswordFound = userService.findPasswordByEmailAndUserId(email, userId);

        Map<String, String> response = new HashMap<>();
        if (isPasswordFound) {
            response.put("status", "success");
            response.put("message", "비밀번호 찾기에 성공했습니다. 이메일을 확인해주세요.");
        } else {
            response.put("status", "fail");
            response.put("message", "해당 이메일과 아이디로 등록된 계정을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        if (tokenOptional.isPresent()) {
            PasswordResetToken resetToken = tokenOptional.get();

            if (resetToken.isExpired()) {
                return ResponseEntity.status(HttpStatus.GONE).body("토큰이 만료되었습니다.");
            }

            Optional<UserEntity> userOptional = userRepository.findByEmail(resetToken.getEmail());
            if (userOptional.isPresent()) {
                UserEntity user = userOptional.get();
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);

                tokenRepository.delete(resetToken); // 토큰 사용 후 삭제
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 토큰입니다.");
    }
}
