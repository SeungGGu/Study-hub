package com.learner.studyhub.Post.controller;

import com.learner.studyhub.Post.entity.Post;
import com.learner.studyhub.Post.repository.PostRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@Data //getter, setter, @NoArgsConstructor(생성자 자동 추가)을 포함하는 lombok 문법

public class PostController {
    private final PostRepository postRepository;
    @PostMapping("api/post")
    private String post(@ResponseBody Post post){
        post.setCreatedDate(LocalDateTime.now());
        Post savedPost = postRepository.save(post);
    }
        return ResponseEntity.status(201).body(savedPost);
    }
        // controller 에선 api/board와 연결해줘고
// 


}
