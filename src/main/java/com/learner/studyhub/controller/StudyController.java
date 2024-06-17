package com.learner.studyhub.controller;

import com.learner.studyhub.dto.StudyDTO;
import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
@ResponseBody
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/study")
public class StudyController {

    private final StudyService studyService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("image") MultipartFile file) {
        String uploadDir = "C:\\inWorkSpace\\Study-hub\\src\\main\\fronted\\public\\images";
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
            String currentTimeStamp = dateFormat.format(new Date());

            String fileExtension = "";
            String originalFileName = file.getOriginalFilename();
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }

            String newFileName = currentTimeStamp + fileExtension;
            String filePath = uploadDir + "/" + newFileName;
            File dest = new File(filePath);
            file.transferTo(dest);

            return ResponseEntity.ok("{\"imagePath\": \"" + newFileName + "\"}");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to upload file\"}");
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<String> studyEdit(@RequestBody StudyDTO studyDTO) {
        try {
            studyService.studyEdit(studyDTO);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("failure");
        }
    }

    @GetMapping("/cardView")
    public ResponseEntity<List<StudyDTO>> getAllStudyCards() {
        List<StudyDTO> studyEntities = studyService.getAllStudyCards().stream()
                .map(entity -> new StudyDTO(
                    entity.getStudyId(),
                    entity.getStudyCreator().getNickname(),
                    entity.getStudyCreateDate(),
                    entity.getStudyLastDate(),
                    entity.getStudyTitle(),
                    entity.getStudyComment(),
                    entity.getStudyTitlePicture(),
                    entity.isPwStatus(),
                    entity.getStudyPw()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(studyEntities);
    }
}
