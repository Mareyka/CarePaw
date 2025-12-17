package com.example.animals.repository;

import com.example.animals.model.ShelterAnimal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShelterAnimalRepository extends JpaRepository<ShelterAnimal, Long> {
    // Найти всех животных определенного вида (например, всех кошек)
    List<ShelterAnimal> findBySpecies(String species);
}
