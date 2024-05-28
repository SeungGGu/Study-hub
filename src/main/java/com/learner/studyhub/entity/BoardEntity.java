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
@Table(name = "board")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer boardId;

    @Column(nullable = false)
    private String boardTitle;

    @ManyToOne
    @JoinColumn(name = "boardNickname", referencedColumnName = "nickname")
    private UserEntity boardNickname;

    @Column(nullable = false)
    private String boardDetail;

    @Column(nullable = false)
    private String boardCategory;

    @Column(nullable = false)
    private int boardView;

    @Column(nullable = false)
    private int boardGreat;


}