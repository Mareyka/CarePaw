package com.example.animals.dto;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String description;
    private String photo;
    private LocalDateTime createdAt;

    // Конструктор со всеми полями (ВАЖНО!)
    public UserResponse(Long id, String username, String email, String role,
                        String description, String photo, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.description = description;
        this.photo = photo;
        this.createdAt = createdAt;
    }

    // Старый конструктор для обратной совместимости (можно удалить позже)
    public UserResponse(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = "user"; // дефолтные значения
        this.description = null;
        this.photo = null;
        this.createdAt = LocalDateTime.now();
    }

    // Геттеры
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDescription() { return description; }
    public String getPhoto() { return photo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}