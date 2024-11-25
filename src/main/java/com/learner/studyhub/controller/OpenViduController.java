package com.learner.studyhub.controller;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:3000", "https://*.ngrok-free.app"}, allowCredentials = "true")
@RestController
public class OpenViduController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    // 세션 매핑 및 참가자 수 관리
    private final Map<String, String> studyToSessionMap = new HashMap<>();
    private final Map<String, Integer> sessionParticipantCountMap = new HashMap<>();

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @PostMapping("/api/sessions")
    public ResponseEntity<String> handleSession(@RequestBody Map<String, String> requestBody) {
        String studyId = requestBody.get("studyId");

        if (studyId == null || studyId.isEmpty()) {
            return new ResponseEntity<>("Study ID is required", HttpStatus.BAD_REQUEST);
        }

        // 기존 세션 확인
        if (studyToSessionMap.containsKey(studyId)) {
            String sessionId = studyToSessionMap.get(studyId);
            Session session = openvidu.getActiveSession(sessionId);

            if (session != null) {
                System.out.println("기존 세션 사용 - 세션 ID: " + sessionId);
                return new ResponseEntity<>(sessionId, HttpStatus.OK);
            } else {
                // 만료된 세션 매핑 제거
                System.out.println("만료된 세션 제거 - 세션 ID: " + sessionId);
                studyToSessionMap.remove(studyId);
                sessionParticipantCountMap.remove(sessionId); // 참가자 수 매핑 제거
            }
        }

        try {
            // 새로운 세션 생성
            String sessionId = "session-" + UUID.randomUUID();
            SessionProperties properties = new SessionProperties.Builder().customSessionId(sessionId).build();
            Session newSession = openvidu.createSession(properties);

            // 매핑 업데이트
            studyToSessionMap.put(studyId, sessionId);
            sessionParticipantCountMap.put(sessionId, 0); // 초기 참가자 수는 0
            System.out.println("새로운 세션 생성 - 세션 ID: " + sessionId);
            return new ResponseEntity<>(sessionId, HttpStatus.CREATED);

        } catch (Exception e) {
            System.err.println("세션 생성 실패: " + e.getMessage());
            return new ResponseEntity<>("Failed to create session: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId) {
        try {
            System.out.println("토큰 생성 요청 - 세션 ID: " + sessionId);

            Session session = openvidu.getActiveSession(sessionId);
            if (session == null) {
                System.err.println("세션을 찾을 수 없음: " + sessionId);
                return new ResponseEntity<>("Session not found: " + sessionId, HttpStatus.NOT_FOUND);
            }

            System.out.println("세션 확인 성공 - 세션 ID: " + sessionId);

            // 참가자 수 증가
            sessionParticipantCountMap.put(sessionId, sessionParticipantCountMap.getOrDefault(sessionId, 0) + 1);
            System.out.println("현재 참가자 수 증가: " + sessionParticipantCountMap.get(sessionId) + " - 세션 ID: " + sessionId);

            ConnectionProperties.Builder builder = new ConnectionProperties.Builder();
            builder.role(OpenViduRole.PUBLISHER).type(ConnectionType.WEBRTC).data("User connected");

            Connection connection = session.createConnection(builder.build());

            System.out.println("토큰 생성 성공: " + connection.getToken());
            return ResponseEntity.ok(connection.getToken());
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            System.err.println("OpenVidu 통신 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create connection: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("일반 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/api/sessions/{sessionId}/check-participants")
    public ResponseEntity<String> leaveSession(@PathVariable String sessionId) {
        try {
            if (!sessionParticipantCountMap.containsKey(sessionId)) {
                System.out.println("세션 참가자 수 매핑 없음 - 세션 ID: " + sessionId);
                return ResponseEntity.ok("세션 참가자 수 매핑 없음");
            }

            // 참가자 수 감소
            int updatedCount = sessionParticipantCountMap.getOrDefault(sessionId, 0) - 1;

            if (updatedCount <= 0) {
                // 참가자가 없으면 매핑 제거
                sessionParticipantCountMap.remove(sessionId);

                // studyToSessionMap에서 sessionId로 studyId 찾기
                String studyIdToRemove = null;
                for (Map.Entry<String, String> entry : studyToSessionMap.entrySet()) {
                    if (entry.getValue().equals(sessionId)) {
                        studyIdToRemove = entry.getKey();
                        break;
                    }
                }

                if (studyIdToRemove != null) {
                    studyToSessionMap.remove(studyIdToRemove);
                    System.out.println("참가자가 없어 매핑 제거 - 세션 ID: " + sessionId + ", studyId: " + studyIdToRemove);
                } else {
                    System.out.println("studyToSessionMap에서 studyId를 찾을 수 없음 - 세션 ID: " + sessionId);
                }
            } else {
                sessionParticipantCountMap.put(sessionId, updatedCount);
                System.out.println("현재 참가자 수 감소: " + updatedCount + " - 세션 ID: " + sessionId);
            }

            return ResponseEntity.ok("참가자 나감 처리 완료");
        } catch (Exception e) {
            System.err.println("세션 참가자 나감 처리 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process leave session: " + e.getMessage());
        }
    }
}
