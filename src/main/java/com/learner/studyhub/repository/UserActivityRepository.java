package com.learner.studyhub.repository;

import com.learner.studyhub.users.entity.UserActivity;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    // 특정 유저와 날짜에 해당하는 활동 기록 조회
    Optional<UserActivity> findByUserAndDate(UserEntity user, LocalDate date);

    // 유저 ID로 활동 기록 조회
    List<UserActivity> findByUser_UserId(String userId);
}