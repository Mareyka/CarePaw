package com.example.animals.dto;

public class SuccessResponseDTO {
    private String message;
    private boolean success = true;

    public SuccessResponseDTO() {}

    public SuccessResponseDTO(String message) {
        this.message = message;
    }

    // Геттеры и сеттеры
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}