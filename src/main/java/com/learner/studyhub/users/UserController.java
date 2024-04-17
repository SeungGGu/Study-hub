package com.learner.studyhub.users;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserController {
    @PostMapping("/api/login")
    public ResponseEntity<?> handleLoginRequest(@RequestBody Users userData) {
        // 로그 출력: 사용자가 입력한 ID와 비밀번호를 확인
        System.out.println("Received login attempt with ID: " + userData.getId() + " and Password: " + userData.getPassword());

        // 간단한 인증 예제 (실제로는 보안을 위해 비밀번호 저장 및 검증시 해시를 사용해야 함)
        if ("admin".equals(userData.getId()) && "admin123".equals(userData.getPassword())) {
            return ResponseEntity.ok("Login Successful!");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/api/register")
    public String registerUser(@RequestBody Users formData) {
        // Process the form data here
        System.out.println("Received form data: " + formData.toString());
        // Return a response message if needed

        String result = "success";

        return result;
    }
}
