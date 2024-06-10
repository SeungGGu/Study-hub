package com.learner.studyhub.service;

import com.learner.studyhub.dto.DrawingDTO;
import com.learner.studyhub.entity.mongo.DrawImage;
import com.learner.studyhub.repository.DrawRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrawingService {

    private final DrawRepository drawRepository;

    @Autowired
    public DrawingService(DrawRepository drawRepository) {
        this.drawRepository = drawRepository;
    }

    public void saveDrawing(DrawingDTO drawingDTO) {
        // Create a new Drawing entity and map the data from DTO
        DrawImage drawImage = new DrawImage();
        drawImage.setDrawTitle(drawingDTO.getDrawTitle());
        drawImage.setStudyId(drawingDTO.getStudyId());
        drawImage.setNickname(drawingDTO.getNickname());
        drawImage.setCanvasData(drawingDTO.getCanvasData());
        drawImage.setTimestamp(drawingDTO.getTimestamp());

        System.out.println(drawImage.getDrawTitle()
                + drawImage.getStudyId()
                + drawImage.getNickname()
                + drawImage.getTimestamp());
        // Save the drawing entity to MongoDB
        drawRepository.save(drawImage);
    }

    public void updateDrawing(String id, DrawingDTO drawingDTO) {
        // Find the existing drawing by id
        DrawImage existingDrawing = drawRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Drawing not found with id: " + id));

        // Update the existing drawing with new data
        existingDrawing.setDrawTitle(drawingDTO.getDrawTitle());
        existingDrawing.setCanvasData(drawingDTO.getCanvasData());
        existingDrawing.setTimestamp(drawingDTO.getTimestamp());

        // Save the updated drawing entity to MongoDB
        drawRepository.save(existingDrawing);
    }

    public List<DrawImage> findByStudyId(String studyId) {
        return drawRepository.findByStudyId(studyId);
    }

    public void deleteCanvasById(String id) {
        drawRepository.deleteById(id);
    }
}
