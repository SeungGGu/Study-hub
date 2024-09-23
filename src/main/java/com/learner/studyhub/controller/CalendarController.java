package com.learner.studyhub.controller;

import com.learner.studyhub.entity.CalendarEntity;
import com.learner.studyhub.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping("/events")
    public List<CalendarEntity> getEventsByStudyId(@RequestParam("studyId") String studyId) {
        return calendarService.getAllEventsByStudyId(studyId);
    }

    @PostMapping("/events")
    public CalendarEntity createEvent(@RequestBody CalendarEntity calendarEntity) {
        return calendarService.createEvent(calendarEntity);
    }
}
