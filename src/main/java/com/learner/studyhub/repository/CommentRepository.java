package com.learner.studyhub.repository;

import com.learner.studyhub.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    List<CommentEntity> findByBoardBoardId(Integer boardId);
    List<CommentEntity> findByUserNickname(String userNickname);
}
