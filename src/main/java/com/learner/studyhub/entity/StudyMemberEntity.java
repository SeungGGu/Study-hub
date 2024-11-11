package com.learner.studyhub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class StudyMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int studyId;  // StudyEntity의 studyId 값 저장

    @Column(nullable = false)
    private String userId;  // UserEntity의 userId 값 저장

    // 기본 생성자
    public StudyMemberEntity() {
    }
}
