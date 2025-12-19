package com.example.animals.controller;

import com.example.animals.dto.ChatMessageRequest;
import com.example.animals.dto.ChatMessageResponse;
import com.example.animals.model.Message;
import com.example.animals.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;  // 👈 импорт нужного класса
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Valid @Payload ChatMessageRequest req) {
        Message message = chatService.createMessage(
                req.getSenderId(),
                req.getRecipientId(),
                req.getContent()
        );

        Long chatId = message.getChat().getId();

        ChatMessageResponse resp = new ChatMessageResponse(
                chatId,
                message.getId(),
                message.getSenderId(),
                req.getRecipientId(),
                message.getContent(),
                message.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/topic/chat." + chatId, resp);
    }
}