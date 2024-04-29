package com.learner.studyhub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "badge")
public class BadgeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int badgeId;

    @Column(nullable = false)
    private String badgeTitle;

    @Column(nullable = false)
    private String badgeComment;

    @Column(nullable = false)
    private String badgeImg;
}
