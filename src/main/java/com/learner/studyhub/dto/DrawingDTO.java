package com.learner.studyhub.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class DrawingDTO {
    private String id;
    private String drawTitle;
    private String studyId;
    private String nickname;
    private Object canvasData;
    private Date timestamp;
}
