package com.learner.studyhub.service;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.repository.LikeRepository;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
