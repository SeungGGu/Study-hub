package com.learner.studyhub.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StudyDTO {
    private int studyId;
    private String studyCreator;
    private String studyCreateDate;
    private String studyLastDate;
    private String studyTitle;
    private String studyComment;
    private String studyTitlePicture;
    private boolean pwStatus;
    private String studyPw;
}
