package com.example.animals.controller;

import com.example.animals.dto.*;
import com.example.animals.model.Subscription;
import com.example.animals.model.User;
import com.example.animals.repository.SubscriptionRepository;
import com.example.animals.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/toggle/{followingId}")
    @Transactional
    public ResponseEntity<?> toggleSubscription(@RequestParam Long followerId, @PathVariable Long followingId) {
        // Проверяем, что пользователи существуют
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("Following not found"));

        // Важно: не даем подписаться на самого себя
        if (followerId.equals(followingId)) {
            return ResponseEntity.badRequest().body("You cannot follow yourself");
        }

        if (subscriptionRepository.existsByFollowerAndFollowing(follower, following)) {
            subscriptionRepository.deleteByFollowerAndFollowing(follower, following);
            return ResponseEntity.ok("Unsubscribed");
        } else {
            Subscription sub = new Subscription();
            sub.setFollower(follower);
            sub.setFollowing(following);
            subscriptionRepository.save(sub);
            return ResponseEntity.ok("Subscribed");
        }
    }

    // ДОБАВЛЕННЫЙ МЕТОД: именно его не хватало фронтенду
    @GetMapping("/check")
    public ResponseEntity<?> checkStatus(@RequestParam Long followerId, @RequestParam Long followingId) {
        User follower = userRepository.findById(followerId).orElse(null);
        User following = userRepository.findById(followingId).orElse(null);

        boolean isSubscribed = false;
        if (follower != null && following != null) {
            isSubscribed = subscriptionRepository.existsByFollowerAndFollowing(follower, following);
        }

        Map<String, Boolean> response = new HashMap<>();
        // Возвращаем ключ "subscribed", чтобы фронтенд его сразу подхватил
        response.put("subscribed", isSubscribed);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<?> getCounts(@PathVariable Long userId) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("followers", subscriptionRepository.countByFollowingId(userId));
        counts.put("following", subscriptionRepository.countByFollowerId(userId));
        return ResponseEntity.ok(counts);
    }
}
