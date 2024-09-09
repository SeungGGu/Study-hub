package com.learner.studyhub.repository;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    // 인기 태그
    List<BoardEntity> findByBoardCategoryContaining(String tag);
    // 인기 게시물
    List<BoardEntity> findAllByOrderByBoardViewDesc();
    // 게시물 검색
    List<BoardEntity> findByBoardTitleContainingIgnoreCase(String title);

    List<BoardEntity> findByBoardCategoryContainingIgnoreCase(String tag);
}

