package com.example.animals.service;

import com.example.animals.model.Chat;
import com.example.animals.model.Message;
import com.example.animals.repository.ChatRepository;
import com.example.animals.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public ChatService(ChatRepository chatRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional
    public Chat getOrCreateChat(Long userAId, Long userBId) {
        if (userAId == null || userBId == null) {
            throw new IllegalArgumentException("user ids must not be null");
        }
        Long first = List.of(userAId, userBId).stream().min(Comparator.naturalOrder()).orElseThrow();
        Long second = List.of(userAId, userBId).stream().max(Comparator.naturalOrder()).orElseThrow();

        return chatRepository
                .findByUser1IdAndUser2Id(first, second)
                .orElseGet(() -> chatRepository.save(new Chat(first, second)));
    }

    @Transactional
    public Message createMessage(Long senderId, Long recipientId, String content) {
        Chat chat = getOrCreateChat(senderId, recipientId);
        Message message = new Message(chat, senderId, content);
        return messageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<Message> getMessagesBetweenUsers(Long userAId, Long userBId) {
        if (userAId == null || userBId == null) {
            throw new IllegalArgumentException("user ids must not be null");
        }

        Long first = List.of(userAId, userBId).stream().min(Comparator.naturalOrder()).orElseThrow();
        Long second = List.of(userAId, userBId).stream().max(Comparator.naturalOrder()).orElseThrow();

        return chatRepository
                .findByUser1IdAndUser2Id(first, second)
                .map(messageRepository::findByChatOrderByCreatedAtAsc)
                .orElseGet(List::of);
    }
}


