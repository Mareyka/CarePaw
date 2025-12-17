package com.example.animals.controller;

import com.example.animals.model.ShelterAnimal;
import com.example.animals.service.ShelterAnimalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelter-animals")
public class ShelterAnimalController {

    private final ShelterAnimalService service;

    public ShelterAnimalController(ShelterAnimalService service) {
        this.service = service;
    }

    // 1. Получить список всех животных в приюте
    // GET /api/shelter-animals
    @GetMapping
    public List<ShelterAnimal> getAll() {
        return service.getAllAnimals();
    }

    // 2. Получить карточку одного животного
    // GET /api/shelter-animals/1
    @GetMapping("/{id}")
    public ResponseEntity<ShelterAnimal> getById(@PathVariable Long id) {
        ShelterAnimal animal = service.getAnimalById(id);
        if (animal != null) {
            return ResponseEntity.ok(animal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. Добавить животное
    // POST /api/shelter-animals
    @PostMapping
    public ShelterAnimal create(@RequestBody ShelterAnimal animal) {
        return service.saveAnimal(animal);
    }
}
