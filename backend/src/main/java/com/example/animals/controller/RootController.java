package com.example.animals.controller;

import com.example.animals.dto.UserResponse;
import com.example.animals.model.User;
import com.example.animals.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class RootController {

    private final UserService userService;

    public RootController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("API is running. Use /api/register (POST), /api/login (POST), /api/users (GET), /api/me (GET)");
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();


        List<UserResponse> userResponses = users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getDescription(),
                        user.getPhoto(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userResponses);
    }

    @GetMapping("/users/random")
    public ResponseEntity<List<UserResponse>> getRandomUsers(
            @RequestParam Long excludeId,
            @RequestParam(defaultValue = "5") int limit) {

        List<User> users = userService.getAllUsers();

        List<User> filtered = users.stream()
                .filter(u -> !u.getId().equals(excludeId))
                .collect(Collectors.toList());

        Collections.shuffle(filtered);

        List<User> randomSelection = filtered.stream()
                .limit(limit)
                .toList();

        List<UserResponse> result = randomSelection.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getDescription(),
                        user.getPhoto(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getDescription(),
                        user.getPhoto(),
                        user.getCreatedAt()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/users/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestParam("username") String username,
            @RequestParam("description") String description,
            @RequestParam(name = "photoFile", required = false) MultipartFile file) {

        // 1. Пытаемся найти пользователя в базе
        java.util.Optional<com.example.animals.model.User> userOpt = userService.getUserById(id);

        // 2. Если пользователя нет — возвращаем 404
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        com.example.animals.model.User user = userOpt.get();

        try {
            // 3. Обновляем текстовые данные
            user.setUsername(username);
            user.setDescription(description);

            // 4. Если пришёл файл — сохраняем его через сервис
            if (file != null && !file.isEmpty()) {
                String fileName = userService.saveAvatar(file);
                user.setPhoto(fileName);
            }

            // 5. Сохраняем обновленного пользователя в БД
            com.example.animals.model.User savedUser = userService.save(user);

            // 6. Формируем ответ (DTO)
            UserResponse response = new UserResponse(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getRole(),
                    savedUser.getDescription(),
                    savedUser.getPhoto(),
                    savedUser.getCreatedAt()
            );

            return ResponseEntity.ok(response);

        } catch (java.io.IOException e) {
            // Если ошибка при записи файла на диск
            return ResponseEntity.internalServerError().build();
        }
    }
}