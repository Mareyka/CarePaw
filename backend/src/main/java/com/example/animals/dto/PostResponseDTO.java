package com.example.animals.dto;

import java.time.Instant;

public class PostResponseDTO {
    private Long id;
    private String title;
    private String photoUrl; // Имя файла из БД
    private String fullPhotoUrl; // Полный URL
    private Long userId;
    private String username;
    private String placeName;
    private boolean isUrgently;
    private Instant createdAt;
    private int likesCount;
    private int savesCount;
    private boolean isLikedByCurrentUser;
    private boolean isSavedByCurrentUser;

    // Пустой конструктор для Jackson
    public PostResponseDTO() {}

    // Конструктор с формированием полного URL
    public PostResponseDTO(Long id, String title, String photoUrl, Long userId, String username,
                           String placeName, boolean isUrgently, Instant createdAt,
                           int likesCount, int savesCount, boolean isLikedByCurrentUser,
                           boolean isSavedByCurrentUser) {
        this.id = id;
        this.title = title;
        this.photoUrl = photoUrl;
        this.userId = userId;
        this.username = username;
        this.placeName = placeName;
        this.isUrgently = isUrgently;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.savesCount = savesCount;
        this.isLikedByCurrentUser = isLikedByCurrentUser;
        this.isSavedByCurrentUser = isSavedByCurrentUser;
        this.fullPhotoUrl = buildFullPhotoUrl(photoUrl);
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
        this.fullPhotoUrl = buildFullPhotoUrl(photoUrl);
    }

    // ВАЖНО: Геттер для полного URL должен быть на фронтенде
    public String getFullPhotoUrl() {
        if (fullPhotoUrl != null) {
            return fullPhotoUrl;
        }
        return buildFullPhotoUrl(photoUrl);
    }

    // Не нужен сеттер для fullPhotoUrl, он генерируется автоматически

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public boolean isUrgently() { return isUrgently; }
    public void setUrgently(boolean urgently) { isUrgently = urgently; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }

    public int getSavesCount() { return savesCount; }
    public void setSavesCount(int savesCount) { this.savesCount = savesCount; }

    public boolean isLikedByCurrentUser() { return isLikedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { isLikedByCurrentUser = likedByCurrentUser; }

    public boolean isSavedByCurrentUser() { return isSavedByCurrentUser; }
    public void setSavedByCurrentUser(boolean savedByCurrentUser) { isSavedByCurrentUser = savedByCurrentUser; }

    // Приватный метод для построения полного URL
    private String buildFullPhotoUrl(String photoUrl) {
        if (photoUrl == null || photoUrl.isEmpty()) {
            return null;
        }

        // Если уже полный URL, возвращаем как есть
        if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
            return photoUrl;
        }

        // Формируем полный URL
        return "http://localhost:8080/api/images/posts/" + photoUrl;
    }

    @Override
    public String toString() {
        return "PostResponseDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", fullPhotoUrl='" + getFullPhotoUrl() + '\'' +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", placeName='" + placeName + '\'' +
                ", isUrgently=" + isUrgently +
                ", createdAt=" + createdAt +
                ", likesCount=" + likesCount +
                ", savesCount=" + savesCount +
                ", isLikedByCurrentUser=" + isLikedByCurrentUser +
                ", isSavedByCurrentUser=" + isSavedByCurrentUser +
                '}';
    }
}