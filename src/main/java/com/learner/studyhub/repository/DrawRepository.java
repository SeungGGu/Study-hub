package com.learner.studyhub.repository;

import com.learner.studyhub.entity.mongo.DrawImage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DrawRepository extends MongoRepository<DrawImage, String> {

}
