package com.learner.studyhub.entity;

import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "studyTime")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 기본 키 필드

    @Column(nullable = false)
    private int studyId;  // StudyEntity의 studyId 값 저장

    @Column(nullable = false)
    private String userId;  // UserEntity의 userId 값 저장

    @ManyToOne
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "studyId", insertable = false, updatable = false)
    private StudyEntity studyEntity;

    @Column(nullable = false)
    private String studyTimeStart;

    @Column(nullable = false)
    private String studyTimeEnd;
}
