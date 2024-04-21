package com.learner.studyhub.users.repository;

import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {

        boolean existsById(String userid);
        boolean existsByNickname(String nickname);
        boolean existsByEmail(String email);
        boolean existsByPhone(String phone);
        UserEntity findByUserid(String userid);
}
