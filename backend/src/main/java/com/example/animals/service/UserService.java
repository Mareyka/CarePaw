package com.example.animals.service;

import com.example.animals.model.User;
import com.example.animals.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public User registerUser(String username, String email, String password, String description) { // Добавили параметр
        // Проверяем, не занят ли email
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email уже используется");
        }

        // Создаем пользователя
        User user = new User(username, email, password,description);

        // Устанавливаем описание перед сохранением!
        user.setDescription(description);

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


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public String saveAvatar(MultipartFile file) throws IOException {
        // Определяем расширение
        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";

        String fileName = UUID.randomUUID().toString() + ext;

        // Путь от корня проекта: uploads/images/profiles
        Path uploadPath = Paths.get("uploads", "images", "profiles").toAbsolutePath().normalize();

        // Создаем папки, если их нет
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path target = uploadPath.resolve(fileName);

        // Копируем поток данных в файл
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("Файл физически сохранен: " + target);
        return fileName;
    }
}