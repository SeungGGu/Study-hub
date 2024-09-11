package com.learner.studyhub.service;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.LikeEntity;
import com.learner.studyhub.repository.LikeRepository;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public boolean hasLiked(UserEntity user, BoardEntity board) {
        return likeRepository.existsByUserAndBoard(user, board);
    }
    public boolean toggleLike(UserEntity user, BoardEntity board) {
        Optional<LikeEntity> existingLike = likeRepository.findByBoardAndUser(board, user);
        if (existingLike.isPresent()) {
            // 좋아요 취소
            likeRepository.delete(existingLike.get());
            return false; // 좋아요 취소 상태
        } else {
            // 좋아요 추가
            LikeEntity newLike = new LikeEntity();
            newLike.setUser(user);
            newLike.setBoard(board);
            likeRepository.save(newLike);
            return true; // 좋아요 상태
        }
    }
}
