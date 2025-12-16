package com.example.animals.controller;

import com.example.animals.dto.ChatMessageRequest;
import com.example.animals.dto.ChatMessageResponse;
import com.example.animals.model.Message;
import com.example.animals.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * WebSocket/STOMP контроллер.
 *
 * Клиент:
 * - Подключается к /ws-chat (SockJS/Stomp)
 * - Отправляет сообщение на /app/chat.send
 * - Подписывается на /topic/chat.{chatIdBetweenUsers}
 *
 * chatId на фронте можно не знать заранее: после первого сообщения
 * сервер вернёт chatId в ChatMessageResponse, и фронт подпишется на него.
 */
@Controller
public class ChatWebSocketController {

    private final ChatService chatService;

    public ChatWebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat.broadcast")
    public ChatMessageResponse sendMessage(@Valid @Payload ChatMessageRequest req) {
        Message message = chatService.createMessage(req.getSenderId(), req.getRecipientId(), req.getContent());

        Long chatId = message.getChat().getId();

        return new ChatMessageResponse(
                chatId,
                message.getId(),
                message.getSenderId(),
                req.getRecipientId(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}



