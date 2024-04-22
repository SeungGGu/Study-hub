package com.learner.studyhub.entity;

import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "studydraw")
public class StudyDrawEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int drawId;

    @ManyToOne
    @JoinColumn(name = "studyId", referencedColumnName = "studyId")
    private StudyEntity studyId;

    @Column(nullable = false)
    private String drawTitle;

    @Column(nullable = false)
    private String drawDate;
}
