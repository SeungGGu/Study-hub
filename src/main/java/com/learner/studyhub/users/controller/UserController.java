package com.learner.studyhub.users.controller;

import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.service.UserService;
import lombok.RequiredArgsConstructor;
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
}
