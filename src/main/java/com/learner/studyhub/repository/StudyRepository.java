package com.learner.studyhub.repository;

import com.learner.studyhub.entity.StudyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyRepository extends JpaRepository<StudyEntity, Integer> {

}
