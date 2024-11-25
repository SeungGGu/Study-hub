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

    // Map to track studyId and their associated sessions
    private final Map<String, String> studyToSessionMap = new HashMap<>();

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * Create or return an existing session for a studyId
     */
    @PostMapping("/api/sessions")
    public ResponseEntity<String> handleSession(@RequestBody Map<String, String> requestBody) {
        String studyId = requestBody.get("studyId");

        if (studyId == null || studyId.isEmpty()) {
            return new ResponseEntity<>("Study ID is required", HttpStatus.BAD_REQUEST);
        }

        // Check if a session already exists for this study
        if (studyToSessionMap.containsKey(studyId)) {
            String sessionId = studyToSessionMap.get(studyId);
            Session session = openvidu.getActiveSession(sessionId);

            if (session != null) {
                System.out.println("Session already exists for study: " + studyId);
                return new ResponseEntity<>(sessionId, HttpStatus.OK);
            } else {
                // Remove expired session mapping
                System.out.println("Session expired for study: " + studyId);
                studyToSessionMap.remove(studyId);
            }
        }

        try {
            // Create a new session
            String sessionId = "session-" + UUID.randomUUID();
            SessionProperties properties = new SessionProperties.Builder().customSessionId(sessionId).build();
            Session newSession = openvidu.createSession(properties);

            studyToSessionMap.put(studyId, newSession.getSessionId());
            System.out.println("New session created for study: " + studyId);
            return new ResponseEntity<>(newSession.getSessionId(), HttpStatus.CREATED);

        } catch (Exception e) {
            System.err.println("Error creating session: " + e.getMessage());
            return new ResponseEntity<>("Failed to create session: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create a connection for a session
     */
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId) {
        try {
            Session session = openvidu.getActiveSession(sessionId);

            if (session == null) {
                System.err.println("세션이 존재하지 않음: " + sessionId);
                return new ResponseEntity<>("세션이 존재하지 않음: " + sessionId, HttpStatus.NOT_FOUND);
            }

            ConnectionProperties.Builder builder = new ConnectionProperties.Builder();
            builder.role(OpenViduRole.PUBLISHER).type(ConnectionType.WEBRTC).data("User connected");

            Connection connection = session.createConnection(builder.build());

            System.out.println("연결 생성 성공: " + connection.getToken());
            return ResponseEntity.ok(connection.getToken());
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            System.err.println("연결 생성 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("연결 생성 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/sessions/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable String sessionId) {
        try {
            Session session = openvidu.getActiveSession(sessionId);
            if (session != null) {
                session.close(); // 세션 강제 종료
                studyToSessionMap.values().remove(sessionId); // 매핑 제거
                System.out.println("세션 강제 종료 성공: " + sessionId);
                return ResponseEntity.ok("세션 종료 성공");
            } else {
                System.out.println("세션이 존재하지 않습니다: " + sessionId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("세션이 존재하지 않습니다.");
            }
        } catch (Exception e) {
            System.err.println("세션 종료 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("세션 종료 실패");
        }
    }
}
