package com.learner.studyhub.users.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.StudyEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Setter
@Getter
@Table(name = "users")
public class UserEntity {

    @Id
    private String userId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role;

    @OneToMany(mappedBy = "boardNickname")
    private Set<BoardEntity> boards;

    @ManyToMany
    @JoinTable(
        name = "user_likes_study",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "study_id")
    )
    private Set<StudyEntity> likedStudies = new HashSet<>();

    // UserActivity와의 관계 (순환 참조 방지)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<UserActivity> activities = new HashSet<>();
}
