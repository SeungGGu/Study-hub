package com.learner.studyhub.users.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Setter
@Getter
@Table(name = "user_activity")
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference  // 순환 참조 방지
    private UserEntity user;

    @Column(nullable = false)
    private LocalDate date; // 일자별 누적 기록을 위한 필드

    @Column
    private long totalDuration;  // 누적 로그인 시간 (분 단위 등)

    // 누적 시간 업데이트
    public void addDuration(long duration) {
        this.totalDuration += duration;
    }
}
