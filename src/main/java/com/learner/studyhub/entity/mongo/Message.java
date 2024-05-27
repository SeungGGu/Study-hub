package com.learner.studyhub.entity.mongo;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@Document(collection = "messages")
public class Message {

    @Id
    private String id;
    private String studyId;
    private String roomId;
    private String userId;
    private String message;
    private Date timestamp;

}
