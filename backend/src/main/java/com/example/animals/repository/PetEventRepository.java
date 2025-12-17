package com.example.animals.repository;

import com.example.animals.model.PetEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetEventRepository extends JpaRepository<PetEvent, Long> {
    // Найти все события конкретного питомца
    List<PetEvent> findByPetId(Long petId);
}
