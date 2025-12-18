package com.example.animals.controller;

import com.example.animals.model.Pet;
import com.example.animals.service.PetService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    // GET http://localhost:8080/api/pets?userId=1
    @GetMapping
    public ResponseEntity<List<Pet>> getPetsByQueryParam(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(petService.getPetsByUserId(userId));
        } else {
            return ResponseEntity.ok(List.of());
        }
    }

    // 1. Старый метод: Получить список всех питомцев через путь
    // Пример запроса: GET /api/pets/user/5
    @GetMapping("/user/{userId}")
    public List<Pet> getPetsByUserPath(@PathVariable Long userId) {
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
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(value = "/{petId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Pet> uploadPetPhoto(
            @PathVariable Long petId,
            @RequestParam("photo") MultipartFile photo
    ) throws IOException {
        Pet pet = petService.getPetById(petId);
        if (pet == null) return ResponseEntity.notFound().build();

        String fileName = savePetFile(photo); // сохрани файл в uploads/images/pets/
        pet.setPhotoUrl(fileName);
        Pet saved = petService.save(pet);

        return ResponseEntity.ok(saved);
    }

    private String savePetFile(MultipartFile file) throws IOException {
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String newName = UUID.randomUUID() + ext;

        Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads/images/pets/");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path target = uploadPath.resolve(newName);
        file.transferTo(target.toFile());

        return newName;
    }

}
