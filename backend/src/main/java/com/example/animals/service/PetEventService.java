package com.example.animals.service;

import com.example.animals.model.PetEvent;
import com.example.animals.repository.PetEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetEventService {

    private final PetEventRepository repository;

    public PetEventService(PetEventRepository repository) {
        this.repository = repository;
    }

    // Получить все события для питомца
    public List<PetEvent> getEventsForPet(Long petId) {
        return repository.findByPetId(petId);
    }

    // Создать событие
    public PetEvent createEvent(PetEvent event) {
        return repository.save(event);
    }
}
