package com.learner.studyhub.controller;

import com.learner.studyhub.dto.DrawingDTO;
import com.learner.studyhub.entity.mongo.DrawImage;
import com.learner.studyhub.service.DrawingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/canvas")
public class DrawController {

    @Autowired
    private DrawingService drawingService;

    @PostMapping("/draw")
    public ResponseEntity<?> saveDrawing(@RequestBody DrawingDTO drawingDTO) {
        drawingService.saveDrawing(drawingDTO);
        System.out.println("Drawing saved");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/view")
    public ResponseEntity<List<DrawImage>> viewDrawing(@RequestParam String studyId) {
        List<DrawImage> drawImages = drawingService.findByStudyId(studyId);
        System.out.println("Drawing retrieved" + drawImages);
        return ResponseEntity.ok(drawImages);
    }
}
