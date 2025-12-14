package com.example.animals.controller;

import com.example.animals.dto.UserResponse;
import com.example.animals.model.User;
import com.example.animals.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class RootController {

    // Внедряем UserService
    private final UserService userService;

    public RootController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("API is running. Use /api/register (POST), /api/login (POST), /api/users (GET)");
    }

    // Теперь это будет реальный метод, возвращающий JSON с пользователями
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        // 1. Получаем всех пользователей из сервиса
        List<User> users = userService.getAllUsers();

        // 2. Преобразуем User в UserResponse (без пароля)
        List<UserResponse> userResponses = users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail()
                ))
                .collect(Collectors.toList());

        // 3. Возвращаем JSON
        return ResponseEntity.ok(userResponses);
    }
}