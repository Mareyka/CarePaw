package com.example.animals.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO, которое приходит от фронта при отправке сообщения.
 * Авторизация у вас по userId, поэтому просто передаём id отправителя и получателя.
 */
public class ChatMessageRequest {

    @NotNull
    private Long senderId;

    @NotNull
    private Long recipientId;

    @NotBlank
    private String content;

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}



