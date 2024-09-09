package com.learner.studyhub.entity;

import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "likes")
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "board_id", referencedColumnName = "boardId")
    private BoardEntity board;
}