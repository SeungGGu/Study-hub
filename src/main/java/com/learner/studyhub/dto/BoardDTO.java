package com.learner.studyhub.dto;

import lombok.*;

import java.util.Date; // 날짜/시간 관련 클래스 임포트
@Getter
@Setter
@ToString
//@NoArgsConstructor
//@AllArgsConstructor
public class BoardDTO { // DTO 클래스 정의
    private Integer boardId; // 게시물 고유 식별자
    private String boardTitle; // 게시물 제목
    private String boardDetail; // 게시물 내용
    private String boardNickname;// 작성자 닉네임
    private String boardCategory;
    private Date createdDate; // 게시물 생성 날짜
    private String userEmail; // 사용자 이메일

}