package com.example.animals.dto;

import java.time.Instant;

public class PostResponse {

    private Long id;
    private String title;
    private Long placeId;
    private String placeName;
    private boolean isUrgently;
    private String photoUrl;
    private Long userId;
    private Instant createdAt;

    public PostResponse() {
    }

    public PostResponse(Long id,
                        String title,
                        Long placeId,
                        String placeName,
                        boolean isUrgently,
                        String photoUrl,
                        Long userId,
                        Instant createdAt) {
        this.id = id;
        this.title = title;
        this.placeId = placeId;
        this.placeName = placeName;
        this.isUrgently = isUrgently;
        this.photoUrl = photoUrl;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getPlaceId() {
        return placeId;
    }

    public void setPlaceId(Long placeId) {
        this.placeId = placeId;
    }

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public boolean isUrgently() {
        return isUrgently;
    }

    public void setUrgently(boolean urgently) {
        isUrgently = urgently;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}


