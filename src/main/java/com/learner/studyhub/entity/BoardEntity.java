package com.learner.studyhub.entity;

import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

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

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentEntity> comments;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LikeEntity> likes;


}