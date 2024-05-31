package com.learner.studyhub.repository;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

}

