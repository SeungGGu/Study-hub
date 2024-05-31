package com.learner.studyhub.controller;

import com.learner.studyhub.entity.mongo.Message;
import com.learner.studyhub.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageRepository messageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message) {
        // 채팅 메시지를 받아서 클라이언트로 전송
        messagingTemplate.convertAndSend("/topic/messages", message);
        System.out.println(message.getMessage());
        // 채팅 메시지를 데이터베이스에 저장
        messageRepository.save(message);
    }

    @GetMapping("/api/messages")
    public ResponseEntity<List<Message>> getMessages(@RequestParam String studyId, @RequestParam String roomId) {
        System.out.println("Request received");
        System.out.println("studyId: " + studyId + ", roomId: " + roomId);
        List<Message> messages = messageRepository.findBystudyIdAndRoomId(studyId, roomId);
        System.out.println("Messages: " + messages);
        return ResponseEntity.ok(messages);
    }

}
