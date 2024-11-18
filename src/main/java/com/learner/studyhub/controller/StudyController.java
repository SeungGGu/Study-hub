package com.learner.studyhub.controller;

import com.learner.studyhub.dto.StudyDTO;
import com.learner.studyhub.entity.ApplicationStatus;
import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    public ResponseEntity<List<StudyDTO>> getAllStudyCards(@RequestParam String nickname) {
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
                        entity.getStudyPw(),
                        entity.getLikes(),  // 최신 좋아요 수
                        entity.getLikedByUsers().stream()
                                .anyMatch(user -> user.getNickname().equals(nickname))  // 사용자가 좋아요를 눌렀는지 확인
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(studyEntities);
    }
    @PostMapping("/{studyId}/like")
    public ResponseEntity<Map<String, Integer>> toggleLike(@PathVariable int studyId, @RequestParam String nickname) {
        try {
            StudyEntity study = studyService.toggleLike(studyId, nickname);
            Map<String, Integer> response = new HashMap<>();
            response.put("likes", study.getLikes());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{studyId}")
    public ResponseEntity<Void> deleteStudy(@PathVariable int studyId) {
        try {
            studyService.deleteStudy(studyId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //마이페이지 닉네임으로 스터디 조회
    @GetMapping("/creator")
    public List<StudyDTO> getStudiesByCreator(@RequestParam String nickname) {
        return studyService.getStudiesByCreator(nickname);
    }

    @GetMapping("/checkMembership")
    public ResponseEntity<Boolean> checkMembership(@RequestParam int studyId, @RequestParam String userId) {
        boolean isMember = studyService.isMember(studyId, userId);
        return ResponseEntity.ok(isMember);
    }

    @PostMapping("/saveApplication")
    public ResponseEntity<String> saveApplication(@RequestBody Map<String, String> payload) {
        String studyId = payload.get("studyId");
        String userId = payload.get("userId");

        studyService.saveApplicationStatus(studyId, userId);

        return ResponseEntity.ok("가입 신청 상태가 저장되었습니다.");
    }

    // 특정 스터디의 가입 신청 목록 조회
    @GetMapping("/{studyId}/applications")
    public ResponseEntity<List<ApplicationStatus>> getApplications(@PathVariable int studyId) {
        List<ApplicationStatus> applications = studyService.getApplicationsByStudyId(studyId);
        return ResponseEntity.ok(applications);
    }

    // 가입 신청 승인
    @PostMapping("/{studyId}/applications/{userId}/approve")
    public ResponseEntity<String> approveApplication(@PathVariable int studyId, @PathVariable String userId) {
        studyService.approveApplication(studyId, userId);
        return ResponseEntity.ok("가입이 승인되었습니다.");
    }

    // 가입 신청 거절
    @PostMapping("/{studyId}/applications/{userId}/reject")
    public ResponseEntity<String> rejectApplication(@PathVariable int studyId, @PathVariable String userId) {
        studyService.rejectApplication(studyId, userId);
        return ResponseEntity.ok("가입 신청이 거절되었습니다.");
    }
}
