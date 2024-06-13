package com.learner.studyhub.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "calendar")
public class CalendarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean allDay;
    private boolean isPublic;
    private String location;
    private String description;

    @ManyToOne
    @JoinColumn(name = "recurrence_id")
    private Recurrence recurrence;

}
