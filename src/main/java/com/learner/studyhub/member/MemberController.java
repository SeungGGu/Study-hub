package com.learner.studyhub.member;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class MemberController {
    @PostMapping("/api/login")
    public ResponseEntity<String> handleLoginRequest(@RequestBody UserData userData){
        String name = userData.getName();

        System.out.println(name);

        return ResponseEntity.ok("Received name: " + name);
    }
}
