package com.learner.studyhub.Post.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long Id;
    @Column(name = "post_title")
    private String title;
    @Column(name = "post_contents")
    private String contents;
    @Column(name = "post_Date")
    private LocalDateTime createdDate;
}
