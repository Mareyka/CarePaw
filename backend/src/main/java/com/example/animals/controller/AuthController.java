package com.example.animals.controller;


import com.example.animals.dto.*;
import com.example.animals.model.User;
import com.example.animals.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already used");
        }
        User user = new User(req.getUsername(), req.getEmail(), req.getPassword());
        User saved = userRepository.save(user);
        UserResponse resp = new UserResponse(saved.getId(), saved.getUsername(), saved.getEmail());
        return ResponseEntity.status(201).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(req.getPassword())) {
                        UserResponse resp = new UserResponse(user.getId(), user.getUsername(), user.getEmail());
                        return ResponseEntity.ok(resp);
                    } else {
                        return ResponseEntity.status(401).body("Invalid credentials");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }
}
