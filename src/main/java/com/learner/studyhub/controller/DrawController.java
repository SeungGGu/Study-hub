package com.learner.studyhub.controller;

import com.learner.studyhub.dto.DrawingDTO;
import com.learner.studyhub.service.DrawingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DrawController {

    @Autowired
    private DrawingService drawingService;

    @PostMapping("/draw")
    public ResponseEntity<?> saveDrawing(@RequestBody DrawingDTO drawingDTO) {
        drawingService.saveDrawing(drawingDTO);
        System.out.println("Drawing saved");
        return ResponseEntity.ok().build();
    }

}
