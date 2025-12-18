package com.example.animals.controller;

import com.example.animals.dto.UserResponse;
import com.example.animals.model.User;
import com.example.animals.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
}