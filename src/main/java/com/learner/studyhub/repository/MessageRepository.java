package com.learner.studyhub.repository;

import com.learner.studyhub.entity.mongo.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
     List<Message> findBystudyIdAndRoomId(String studyId, String roomId);
}
