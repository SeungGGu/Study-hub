package com.learner.studyhub.repository;

import com.learner.studyhub.entity.CalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarRepository extends JpaRepository<CalendarEntity, Long>{
    List<CalendarEntity> findByStudyId(String studyId);
}
