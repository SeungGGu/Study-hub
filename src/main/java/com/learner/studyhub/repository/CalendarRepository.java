package com.learner.studyhub.repository;

import com.learner.studyhub.entity.CalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarRepository extends JpaRepository<CalendarEntity, Long>{
}
