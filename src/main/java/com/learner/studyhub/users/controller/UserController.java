package com.learner.studyhub.users.controller;

import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/register")
    public String registerUser(@RequestBody UsersDTO userData) {
        // Process the form data here
        System.out.println("Received form data: " + userData.toString());
        // Return a response message if needed
        userService.registerUser(userData);
        String result = "success";

        return result;
    }
}
