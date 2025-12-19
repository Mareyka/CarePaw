package com.example.animals.dto;

public class LikeSaveRequestDTO {
    private Long postId;
    private Long userId;

    // Конструкторы
    public LikeSaveRequestDTO() {
    }

    public LikeSaveRequestDTO(Long postId, Long userId) {
        this.postId = postId;
        this.userId = userId;
    }

    // Геттеры и сеттеры
    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}