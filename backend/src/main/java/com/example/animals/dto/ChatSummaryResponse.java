package com.example.animals.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatSummaryResponse {
    private Long id;
    private String title;
    private String avatarUri;
    private String lastMessage;
    private Long recipientId;
}
