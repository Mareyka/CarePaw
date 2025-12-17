package com.example.animals.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Email или username обязателен")
    private String identifier; // меняем email на identifier

    @NotBlank(message = "Пароль обязателен")
    private String password;

    // Геттеры и сеттеры
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // Для обратной совместимости (если нужно)
    public String getEmail() { return identifier; }
    public void setEmail(String email) { this.identifier = email; }
}
