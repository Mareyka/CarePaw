package com.example.animals.controller;

import com.example.animals.model.Pet;
import com.example.animals.model.PetEvent;
import com.example.animals.service.PetEventService;
import com.example.animals.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:8081")
public class PetEventController {

    private final PetEventService eventService;
    private final PetService petService;

    public PetEventController(PetEventService eventService, PetService petService) {
        this.eventService = eventService;
        this.petService = petService;
    }

    // 1. Получить все события для питомца
    // GET /api/events/pet/1
    @GetMapping("/pet/{petId}")
    public List<PetEvent> getEventsByPet(@PathVariable Long petId) {
        return eventService.getEventsForPet(petId);
    }

    // 2. Создать событие для питомца
    // POST /api/events?petId=1
    @PostMapping
    public ResponseEntity<PetEvent> createEvent(@RequestBody PetEvent event, @RequestParam Long petId) {
        Pet pet = petService.getPetById(petId);
        if (pet == null) {
            return ResponseEntity.badRequest().build();
        }
        event.setPet(pet);
        return ResponseEntity.ok(eventService.createEvent(event));
    }
}
