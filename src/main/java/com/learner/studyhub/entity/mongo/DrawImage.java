package com.learner.studyhub.entity.mongo;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@Document(collection = "drawImage")
public class DrawImage {
    @Id
    private String id;
    private String drawTitle;
    private String studyId;
    private String nickname;
    private Object canvasData;
    private Date timestamp;
}
