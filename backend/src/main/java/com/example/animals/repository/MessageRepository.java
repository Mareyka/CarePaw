package com.example.animals.repository;

import com.example.animals.model.Chat;
import com.example.animals.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatOrderByCreatedAtAsc(Chat chat);
    Message findTopByChatIdOrderByCreatedAtDesc(Long chat_id);

}



