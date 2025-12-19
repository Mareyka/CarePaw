package com.example.animals.controller;

import com.example.animals.dto.ChatMessageResponse;
import com.example.animals.dto.ChatSummaryResponse;
import com.example.animals.model.Chat;
import com.example.animals.model.Message;
import com.example.animals.model.User;
import com.example.animals.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
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

    @PostMapping("/create")
    public ResponseEntity<Long> createChat(@RequestParam Long userAId,
                                           @RequestParam Long userBId) {
        Chat chat = chatService.getOrCreateChat(userAId, userBId);
        return ResponseEntity.ok(chat.getId());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatSummaryResponse>> getUserChats(@PathVariable Long userId) {
        List<ChatSummaryResponse> chats = chatService
                .getChatsForUser(userId).stream()
                .map(chat -> {
                    Message last = chatService.getLastMessage(chat.getId());
                    User companion = chatService.getCompanion(chat, userId);
                    return new ChatSummaryResponse(
                            chat.getId(),
                            companion.getUsername(),
                            companion.getPhoto(),
                            last != null ? last.getContent() : "",
                            Objects.equals(chat.getUser1Id(), userId) ?  chat.getUser2Id() : chat.getUser1Id()
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(chats);
    }
}



