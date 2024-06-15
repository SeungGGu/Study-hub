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
    public String uploadFile(@RequestParam("image") MultipartFile file) {
        //자신의 컴퓨터로 바꿔서 테스트하기
        String uploadDir = "C:\\inWorkSpace\\Study-hub\\src\\main\\fronted\\public\\images";

        try {
            //현재 시간을 기반으로 파일 이름 생성
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
            String currentTimeStamp = dateFormat.format(new Date());
            // 파일 확장자 추출
            String fileExtension = "";
            String originalFileName = file.getOriginalFilename();
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }

            // 새로운 파일 이름 생성
            String newFileName = currentTimeStamp + fileExtension;

            // 파일 저장
            String filePath = uploadDir + "/" + newFileName;
            File dest = new File(filePath);
            file.transferTo(dest);

            // 파일 이름을 클라이언트에 반환
            return "{\"imagePath\": \"" + newFileName + "\"}";
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"error\": \"Failed to upload file\"}";
        }
    }

    @PostMapping("/edit")
    public Object studyEdit(@RequestBody StudyDTO studyDTO) {

        System.out.println("Received form data: " + studyDTO.toString());

        return studyService.studyEdit(studyDTO);
    }

    @GetMapping("/cardView")
    public List<StudyEntity> getAllStudyCards() {
        List<StudyEntity> studyEntities = studyService.getAllStudyCards();
        for (StudyEntity entity : studyEntities) {
            System.out.println(entity.toString());
        }
        return studyEntities;
    }
}
