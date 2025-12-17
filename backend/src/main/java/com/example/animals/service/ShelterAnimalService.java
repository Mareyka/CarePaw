package com.example.animals.service;

import com.example.animals.model.ShelterAnimal;
import com.example.animals.repository.ShelterAnimalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShelterAnimalService {

    private final ShelterAnimalRepository repository;

    public ShelterAnimalService(ShelterAnimalRepository repository) {
        this.repository = repository;
    }

    // Получить всех животных приюта
    public List<ShelterAnimal> getAllAnimals() {
        return repository.findAll();
    }

    // Получить конкретное животное по ID
    public ShelterAnimal getAnimalById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Добавить животное в базу (админка)
    public ShelterAnimal saveAnimal(ShelterAnimal animal) {
        return repository.save(animal);
    }
}
