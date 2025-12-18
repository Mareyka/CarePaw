package com.example.animals.repository;

import com.example.animals.model.Subscription;
import com.example.animals.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // Проверка, есть ли подписка
    boolean existsByFollowerAndFollowing(User follower, User following);

    // Удаление подписки (отписка)
    void deleteByFollowerAndFollowing(User follower, User following);

    // Количество подписчиков (на кого подписаны)
    long countByFollowingId(Long followingId);

    // Количество подписок (кто подписан)
    long countByFollowerId(Long followerId);
}