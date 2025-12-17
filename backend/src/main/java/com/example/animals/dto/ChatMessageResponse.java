package com.example.animals.dto;

import java.time.Instant;

public class ChatMessageResponse {

    private Long chatId;
    private Long messageId;
    private Long senderId;
    private Long recipientId;
    private String content;
    private Instant createdAt;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(Long chatId,
                               Long messageId,
                               Long senderId,
                               Long recipientId,
                               String content,
                               Instant createdAt) {
        this.chatId = chatId;
        this.messageId = messageId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}



