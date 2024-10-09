package com.learner.studyhub.users.controller;

import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@ResponseBody
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @PostMapping("/loginProc")
    public Object loginUser(@RequestBody UsersDTO usersDTO){
        return userService.loginUser(usersDTO);
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
}
