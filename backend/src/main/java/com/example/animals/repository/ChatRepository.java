package com.example.animals.repository;

import com.example.animals.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

}



