package com.learner.studyhub.repository;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.LikeEntity;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByBoardAndUser(BoardEntity board, UserEntity user);
    long countByBoard(BoardEntity board);
    boolean existsByUserAndBoard(UserEntity user, BoardEntity board);


}