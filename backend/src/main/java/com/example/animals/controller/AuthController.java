package com.example.animals.controller;

import com.example.animals.dto.*;
import com.example.animals.model.User;
import com.example.animals.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already used");
        }

        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Username already used");
        }

        User user = new User(req.getUsername(), req.getEmail(), req.getPassword());

        if (req.getDescription() != null) {
            user.setDescription(req.getDescription());
        }

        User saved = userRepository.save(user);

        UserResponse resp = new UserResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getRole(),
                saved.getDescription(),
                saved.getPhoto(),
                saved.getCreatedAt()
        );

        return ResponseEntity.status(201).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest req) {
        Optional<User> userOpt;

        // Определяем, является ли identifier email'ом или username'ом
        String identifier = req.getEmail(); // Внимание: переименуем поле в LoginRequest
        boolean isEmail = identifier.contains("@");

        if (isEmail) {
            // Ищем по email
            userOpt = userRepository.findByEmail(identifier);
        } else {
            // Ищем по username
            userOpt = userRepository.findByUsername(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        UserResponse resp = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getDescription(),
                user.getPhoto(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        UserResponse resp = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getDescription(),
                user.getPhoto(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(resp);
    }
}