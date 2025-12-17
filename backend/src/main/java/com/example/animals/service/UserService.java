package com.example.animals.service;

import com.example.animals.model.User;
import com.example.animals.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    // Метод для получения всех пользователей
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Метод для регистрации
    public User registerUser(String username, String email, String password) {
        // Проверяем, не занят ли email
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email уже используется");
        }

        // Создаем и сохраняем пользователя
        User user = new User(username, email, password);
        return userRepository.save(user);
    }

    // Метод для логина
    public Optional<User> loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt;
        }

        return Optional.empty();
    }

    // Дополнительные полезные методы:
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}