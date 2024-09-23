package com.learner.studyhub.entity;

import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Setter
@Getter
@Table(name = "study")
public class StudyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studyId;

    @ManyToOne
    @JoinColumn(name = "study_creator", referencedColumnName = "nickname")
    private UserEntity studyCreator;

    @Column(nullable = false)
    private String studyCreateDate;

    @Column(nullable = false)
    private String studyLastDate;

    @Column(nullable = false)
    private String studyTitle;

    @Column(nullable = false)
    private String studyComment;

    @Column(nullable = false)
    private String studyTitlePicture;

    @Column(nullable = false)
    private boolean pwStatus;

    private String studyPw;

    @Column(nullable = false)
    private int likes = 0;  // 좋아요 수를 저장하는 필드

    @ManyToMany(mappedBy = "likedStudies")
    private Set<UserEntity> likedByUsers = new HashSet<>();
}
