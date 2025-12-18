package com.example.animals.service;

import com.example.animals.model.Post;
import com.example.animals.model.PostLike;
import com.example.animals.model.User;
import com.example.animals.repository.PostLikeRepository;
import com.example.animals.repository.PostRepository;
import com.example.animals.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void addLike(Long postId, Long userId) {
        // Проверяем, не существует ли уже лайк
        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            return; // Лайк уже существует
        }

        // Получаем пост и пользователя
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Создаем и сохраняем лайк
        PostLike like = new PostLike(post, user);
        postLikeRepository.save(like);
    }

    @Transactional
    public void removeLike(Long postId, Long userId) {
        Optional<PostLike> like = postLikeRepository.findByPostIdAndUserId(postId, userId);
        like.ifPresent(postLikeRepository::delete);
    }

    public boolean isPostLikedByUser(Long postId, Long userId) {
        return postLikeRepository.existsByPostIdAndUserId(postId, userId);
    }

    public int getLikesCount(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }
}