package com.example.animals.repository;

import com.example.animals.model.Subscription;
import com.example.animals.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // Проверка, есть ли подписка
    boolean existsByFollowerAndFollowing(User follower, User following);

    // Удаление подписки (отписка)
    @Modifying // ОБЯЗАТЕЛЬНО для deleteBy
    @Transactional
    // ОБЯЗАТЕЛЬНО, если метод вызывается из сервиса/контроллера
    void deleteByFollowerAndFollowing(User follower, User following);

    // Количество подписчиков (на кого подписаны)
    long countByFollowingId(Long followingId);

    // Количество подписок (кто подписан)
    long countByFollowerId(Long followerId);
}