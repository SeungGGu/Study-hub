package com.learner.studyhub.controller;

import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.service.StudyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studyMember")
@RequiredArgsConstructor
public class StudyMemberController {

    private final StudyMemberService studyMemberService;

    @GetMapping("/byUser/{userId}")
    public ResponseEntity<List<StudyEntity>> getStudiesByUserId(@PathVariable String userId) {
        List<StudyEntity> studies = studyMemberService.findStudiesByUserId(userId);
        return ResponseEntity.ok(studies);
    }
}
