package com.example.animals.repository;

import com.example.animals.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    // Найти всех питомцев конкретного пользователя
    List<Pet> findByOwnerId(Long userId);
}
