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

    @PostMapping("/api/register")
    public String registerUser(@RequestBody MemberData formData) {
        // Process the form data here
        System.out.println("Received form data: " + formData.toString());
        // Return a response message if needed

        String result = "success";
//        if(데이터가 잘 들어갔을때){
//            result = "success";
//        }else{
//            result = "다시 가입하세요";
//        }
        return result;
    }
}
