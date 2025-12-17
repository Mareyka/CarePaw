package com.example.animals.dto;

import java.time.Instant;

public class PostResponseDTO {
    private Long id;
    private String title;
    private String photoUrl;
    private Long userId;
    private String username;
    private String placeName;
    private boolean isUrgently;
    private Instant createdAt;
    private int likesCount;
    private int savesCount;
    private boolean isLikedByCurrentUser;
    private boolean isSavedByCurrentUser;

    // Конструкторы
    public PostResponseDTO() {}

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
    }

    // Геттеры
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getPlaceName() {
        return placeName;
    }

    public boolean isUrgently() {
        return isUrgently;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public int getSavesCount() {
        return savesCount;
    }

    public boolean isLikedByCurrentUser() {
        return isLikedByCurrentUser;
    }

    public boolean isSavedByCurrentUser() {
        return isSavedByCurrentUser;
    }

    // Сеттеры
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public void setUrgently(boolean urgently) {
        isUrgently = urgently;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public void setSavesCount(int savesCount) {
        this.savesCount = savesCount;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        isLikedByCurrentUser = likedByCurrentUser;
    }

    public void setSavedByCurrentUser(boolean savedByCurrentUser) {
        isSavedByCurrentUser = savedByCurrentUser;
    }

    @Override
    public String toString() {
        return "PostResponseDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
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