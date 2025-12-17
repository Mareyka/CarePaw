package com.example.animals.controller;

import com.example.animals.model.Pet;
import com.example.animals.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    // 1. Получить список всех питомцев конкретного пользователя
    // Пример запроса: GET /api/pets/user/5
    @GetMapping("/user/{userId}")
    public List<Pet> getPetsByUser(@PathVariable Long userId) {
        return petService.getPetsByUserId(userId);
    }

    // 2. Получить данные одного питомца (для Паспорта)
    // Пример запроса: GET /api/pets/1
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        Pet pet = petService.getPetById(id);
        if (pet != null) {
            return ResponseEntity.ok(pet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. Добавить нового питомца пользователю
    // Пример запроса: POST /api/pets?userId=5
    // В теле запроса (Body) нужно передать JSON с данными питомца
    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet, @RequestParam Long userId) {
        try {
            Pet newPet = petService.addPet(pet, userId);
            return ResponseEntity.ok(newPet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); // Если юзер не найден
        }
    }
}
