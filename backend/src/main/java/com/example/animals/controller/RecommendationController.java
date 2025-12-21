package com.example.animals.controller;

import com.example.animals.dto.UserResponse;
import com.example.animals.model.User;
import com.example.animals.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class RecommendationController {

    private final UserRepository userRepository;

    public RecommendationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getRecommendedUsers(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @RequestParam(defaultValue = "6") int limit) {

        try {
            // Получаем всех пользователей
            List<User> allUsers = userRepository.findAll();

            // Исключаем текущего пользователя из списка
            List<User> filteredUsers = allUsers.stream()
                    .filter(user -> {
                        if (currentUserId == null) {
                            return true;
                        }
                        return !user.getId().equals(currentUserId);
                    })
                    .collect(Collectors.toList());

            List<User> recommendedUsers = selectUsersForRecommendation(filteredUsers, limit);

            List<UserResponse> response = recommendedUsers.stream()
                    .map(this::convertToUserResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private List<User> selectUsersForRecommendation(List<User> users, int limit) {
        if (users.size() <= limit) {
            return users;
        }

        List<User> organizations = users.stream()
                .filter(u -> "CLINIC".equalsIgnoreCase(u.getRole()) || "SHELTER".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        List<User> regularUsers = users.stream()
                .filter(u -> !"CLINIC".equalsIgnoreCase(u.getRole()) && !"SHELTER".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        // Сортируем по дате создания
        organizations.sort((u1, u2) -> u2.getCreatedAt().compareTo(u1.getCreatedAt()));
        regularUsers.sort((u1, u2) -> u2.getCreatedAt().compareTo(u1.getCreatedAt()));

        // Формируем финальный список
        List<User> result = new ArrayList<>();

        int orgCount = Math.min(organizations.size(), limit / 2);
        int userCount = Math.min(regularUsers.size(), limit - orgCount);

        result.addAll(organizations.subList(0, orgCount));
        result.addAll(regularUsers.subList(0, userCount));

        if (result.size() < limit) {
            Set<Long> existingIds = result.stream()
                    .map(User::getId)
                    .collect(Collectors.toSet());

            List<User> remainingUsers = users.stream()
                    .filter(u -> !existingIds.contains(u.getId()))
                    .limit(limit - result.size())
                    .collect(Collectors.toList());

            result.addAll(remainingUsers);
        }

        // Перемешиваем результат
        Collections.shuffle(result);

        return result;
    }

    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getDescription(),
                user.getPhoto(),
                user.getCreatedAt()
        );
    }
}