package com.learner.studyhub.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CommentDTO {
    private Integer commentId;
    private Integer boardId;
    private String userNickname;
    private String commentText;
    private Date createdDate;
    private String boardTitle;
}

