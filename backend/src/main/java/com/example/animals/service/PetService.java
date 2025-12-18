package com.example.animals.service;

import com.example.animals.model.Pet;
import com.example.animals.model.User;
import com.example.animals.repository.PetRepository;
import com.example.animals.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public PetService(PetRepository petRepository, UserRepository userRepository) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    // Получить всех питомцев пользователя
    public List<Pet> getPetsByUserId(Long userId) {
        return petRepository.findByOwnerId(userId);
    }

    // Добавить нового питомца (с привязкой к User)
    public Pet addPet(Pet pet, Long userId) {
        // Ищем пользователя по ID
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            pet.setOwner(user.get()); // Привязываем питомца к найденному пользователю
            return petRepository.save(pet);
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }

    // Сохранить питомца (используется при обновлении фото)
    public Pet save(Pet pet) {
        return petRepository.save(pet);
    }



    // Получить питомца по ID
    public Pet getPetById(Long id) {
        return petRepository.findById(id).orElse(null);
    }
}
