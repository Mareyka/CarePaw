package com.example.animals.controller;

import com.example.animals.dto.ChatMessageResponse;
import com.example.animals.model.Message;
import com.example.animals.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ChatRestController {

    private final ChatService chatService;

    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageResponse>> getHistory(
            @RequestParam Long userAId,
            @RequestParam Long userBId
    ) {
        List<Message> messages = chatService.getMessagesBetweenUsers(userAId, userBId);

        List<ChatMessageResponse> response = messages.stream()
                .map(m -> new ChatMessageResponse(
                        m.getChat().getId(),
                        m.getId(),
                        m.getSenderId(),
                        m.getSenderId().equals(userAId) ? userBId : userAId,
                        m.getContent(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}



