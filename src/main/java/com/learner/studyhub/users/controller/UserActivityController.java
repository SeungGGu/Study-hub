package com.learner.studyhub.users.controller;

import com.learner.studyhub.users.entity.UserActivity;
import com.learner.studyhub.users.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/activity")
public class UserActivityController {

    private final UserActivityService userActivityService;

    // 특정 사용자의 활동 기록을 가져오기
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserActivity>> getUserActivities(@PathVariable String userId) {
        List<UserActivity> activities = userActivityService.getActivitiesByUserId(userId);
        if (activities != null && !activities.isEmpty()) {
            return ResponseEntity.ok(activities);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 새로운 활동 기록을 추가하거나 누적 시간을 업데이트하는 메소드
    @PostMapping("/log")
    public ResponseEntity<UserActivity> logUserActivity(@RequestBody String userId) {
        UserActivity savedActivity = userActivityService.logOrUpdateUserActivity(userId); // 로그인 시간 누적
        return ResponseEntity.status(HttpStatus.CREATED).body(savedActivity);
    }

    // 사용자의 활동 시간을 업데이트 (로그아웃이나 세션 종료 시 호출)
    @PutMapping("/update-duration/{userId}")
    public ResponseEntity<UserActivity> updateDuration(
            @PathVariable String userId,
            @RequestBody Map<String, Long> request) {  // @RequestBody로 JSON 형식의 데이터 받음
        Long duration = request.get("duration");

        // duration 값이 없으면 BadRequest 반환
        if (duration == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // 서비스 호출하여 유저 활동 시간 업데이트
        try {
            UserActivity updatedActivity = userActivityService.updateUserActivityDuration(userId, duration);
            return ResponseEntity.ok(updatedActivity);
        } catch (IllegalArgumentException e) {
            // 유저가 없거나 다른 문제가 생긴 경우 처리
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            // 기타 예외 발생 시 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
