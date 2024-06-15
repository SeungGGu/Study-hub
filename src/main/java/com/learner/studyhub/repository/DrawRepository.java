package com.learner.studyhub.repository;

import com.learner.studyhub.entity.mongo.DrawImage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DrawRepository extends MongoRepository<DrawImage, String> {
    List<DrawImage> findByStudyId(String studyId);
}
