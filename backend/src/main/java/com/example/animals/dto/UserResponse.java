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

    // Конструктор со всеми полями
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



    // Геттеры
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDescription() { return description; }
    public String getPhoto() { return photo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}