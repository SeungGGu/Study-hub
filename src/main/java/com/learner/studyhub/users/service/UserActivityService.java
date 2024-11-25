package com.learner.studyhub.users.service;

import com.learner.studyhub.repository.UserActivityRepository;
import com.learner.studyhub.repository.UserRepository;
import com.learner.studyhub.users.entity.UserActivity;
import com.learner.studyhub.users.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityRepository userActivityRepository;
    private final UserRepository userRepository;

    // 특정 사용자의 활동 기록을 조회
    public List<UserActivity> getActivitiesByUserId(String userId) {
        return userActivityRepository.findByUser_UserId(userId);
    }

    // 새로운 활동 기록을 추가하거나 해당 날짜의 기록을 업데이트
    public UserActivity logOrUpdateUserActivity(String userId) {
        // 사용자를 찾음
        UserEntity user = userRepository.findByUserId(userId);

        // 오늘 날짜의 기존 기록을 찾음
        LocalDate today = LocalDate.now();
        Optional<UserActivity> existingActivityOpt = userActivityRepository.findByUserAndDate(user, today);

        UserActivity userActivity;
        if (existingActivityOpt.isPresent()) {
            // 기존 기록이 있으면 총 시간을 누적
            userActivity = existingActivityOpt.get();
            userActivity.addDuration(1); // 여기서 1분을 누적한다는 가정
        } else {
            // 기존 기록이 없으면 새로 생성
            userActivity = new UserActivity();
            userActivity.setUser(user);
            userActivity.setDate(today);
            userActivity.setTotalDuration(1); // 처음 로그인 시 1분으로 시작
        }

        return userActivityRepository.save(userActivity);
    }
    // 특정 사용자의 활동 시간 누적
    @Transactional
    public UserActivity updateUserActivityDuration(String userId, long duration) {
        // 유저 검색
        UserEntity user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("해당하는 유저가 없습니다: " + userId);
        }

        // 동일 날짜와 유저에 대한 기록이 있는지 확인
        LocalDate today = LocalDate.now();
        UserActivity userActivity = userActivityRepository.findByUserAndDate(user, today)
                .orElseGet(() -> {
                    // 없으면 새로운 기록 생성
                    UserActivity newActivity = new UserActivity();
                    newActivity.setUser(user);
                    newActivity.setDate(today);
                    newActivity.setTotalDuration(0); // 기본 0
                    return newActivity;
                });

        // 기존 혹은 새로 생성된 활동 시간에 duration을 추가
        userActivity.addDuration(duration);

        // 업데이트된 기록을 저장
        return userActivityRepository.save(userActivity);
    }
}
