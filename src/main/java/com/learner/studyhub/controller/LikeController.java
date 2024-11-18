package com.learner.studyhub.controller;

import com.learner.studyhub.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // 좋아요 토글 (추가 또는 삭제)
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @RequestParam String nickname,
            @RequestParam Integer boardId) {
        boolean isLiked = likeService.toggleLike(nickname, boardId);
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }

    // 사용자가 특정 게시물을 좋아하는지 확인
    @GetMapping("/check")
    public ResponseEntity<Boolean> isBoardLikedByUser(
            @RequestParam String nickname,
            @RequestParam Integer boardId) {
        boolean isLiked = likeService.isBoardLikedByUser(nickname, boardId);
        return ResponseEntity.ok(isLiked);
    }

    // 사용자가 좋아요한 게시물 목록 조회
    @GetMapping("/user/{nickname}")
    public ResponseEntity<List<Integer>> getUserLikedBoards(@PathVariable String nickname) {
        List<Integer> likedBoards = likeService.getUserLikedBoards(nickname);
        return ResponseEntity.ok(likedBoards);
    }
}