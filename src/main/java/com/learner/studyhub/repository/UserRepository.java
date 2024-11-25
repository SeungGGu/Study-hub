package com.learner.studyhub.repository;

import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {

    boolean existsById(String userId);

    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    UserEntity findByUserId(String userId);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByNickname(String nickname);

    Optional<UserEntity> findByEmailAndName(String email, String name);

    Optional<UserEntity> findByEmailAndUserId(String email, String userId);
}
