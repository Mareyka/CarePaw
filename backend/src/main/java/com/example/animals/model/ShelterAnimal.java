package com.example.animals.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shelter_animals")
public class ShelterAnimal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String species;
    private String breed;
    private Integer age;

    @Column(length = 1000)
    private String description;

    private String photoUrl;

    // Контакты приюта
    private String shelterAddress;
    private String shelterEmail;
    private String shelterPhone;

    @Column(name = "shelter_id")
    private Long shelterId;

    private boolean isAdopted;

    // ГЕТТЕРЫ И СЕТТЕРЫ ДЛЯ ВСЕХ ПОЛЕЙ

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getShelterAddress() { return shelterAddress; }
    public void setShelterAddress(String shelterAddress) { this.shelterAddress = shelterAddress; }

    public String getShelterEmail() { return shelterEmail; }
    public void setShelterEmail(String shelterEmail) { this.shelterEmail = shelterEmail; }

    public String getShelterPhone() { return shelterPhone; }
    public void setShelterPhone(String shelterPhone) { this.shelterPhone = shelterPhone; }

    public Long getShelterId() { return shelterId; }
    public void setShelterId(Long shelterId) { this.shelterId = shelterId; }

    public boolean isAdopted() { return isAdopted; }
    public void setAdopted(boolean adopted) { isAdopted = adopted; }
}
