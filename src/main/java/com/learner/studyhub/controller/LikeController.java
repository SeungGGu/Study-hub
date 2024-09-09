package com.learner.studyhub.controller;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.repository.BoardRepository;
import com.learner.studyhub.service.LikeService;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;
    private final BoardRepository boardRepository;

    @Autowired
    public LikeController(LikeService likeService, BoardRepository boardRepository) {
        this.likeService = likeService;
        this.boardRepository = boardRepository;
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> hasLiked(@RequestParam Integer boardId, @AuthenticationPrincipal UserEntity user) {
        // boardId로 게시물 조회 로직 추가
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시물을 찾을 수 없습니다."));

        boolean liked = likeService.hasLiked(user, board);
        return ResponseEntity.ok(liked);
    }
}