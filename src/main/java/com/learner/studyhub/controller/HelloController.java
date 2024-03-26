package com.learner.studyhub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/test")
    public String hello() {
        return "테스트입니다.";
    }
}