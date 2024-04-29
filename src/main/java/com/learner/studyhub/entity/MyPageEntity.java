package com.learner.studyhub.entity;

import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mypage")
public class MyPageEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private UserEntity user;

    //상태메세지
    private String userMessage;

    private String userProfilePicture;

    //목표
    private String userGoal;

    private int badgeId;
}
