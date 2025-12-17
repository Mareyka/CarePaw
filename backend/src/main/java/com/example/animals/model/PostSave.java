package com.example.animals.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "post_saves",
        uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
public class PostSave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private Instant savedAt = Instant.now();

    public PostSave() {}

    public PostSave(Post post, User user) {
        this.post = post;
        this.user = user;
        this.savedAt = Instant.now();
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Instant getSavedAt() { return savedAt; }
    public void setSavedAt(Instant savedAt) { this.savedAt = savedAt; }
}