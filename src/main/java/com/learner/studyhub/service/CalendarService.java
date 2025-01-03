package com.learner.studyhub.service;

import com.learner.studyhub.entity.CalendarEntity;
import com.learner.studyhub.entity.Recurrence;
import com.learner.studyhub.repository.CalendarRepository;
import com.learner.studyhub.repository.RecurrenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private RecurrenceRepository recurrenceRepository;

    public List<CalendarEntity> getAllEventsByStudyId(String studyId) {
        return calendarRepository.findByStudyId(studyId);
    }

    public CalendarEntity createEvent(CalendarEntity calendarEntity) {
        Recurrence recurrence = calendarEntity.getRecurrence();
        if (recurrence != null) {
            recurrence = recurrenceRepository.save(recurrence);
            calendarEntity.setRecurrence(recurrence);
        }
        return calendarRepository.save(calendarEntity);
    }

    public void deleteEventById(Long id) {
        calendarRepository.deleteById(id);
    }
}
