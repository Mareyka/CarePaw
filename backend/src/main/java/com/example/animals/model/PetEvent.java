package com.example.animals.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // Важно добавить этот импорт
import java.time.LocalDateTime;

@Entity
@Table(name = "pet_events")
public class PetEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    private String description;

    private String eventType;

    // Чье это событие
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnore // ОБЯЗАТЕЛЬНО: чтобы не было ошибки при отправке ответа
    private Pet pet;

    // --- Геттеры и Сеттеры ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
}
