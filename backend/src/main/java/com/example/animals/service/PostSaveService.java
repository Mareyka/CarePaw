package com.example.animals.service;

import com.example.animals.model.Post;
import com.example.animals.model.PostSave;
import com.example.animals.model.User;
import com.example.animals.repository.PostRepository;
import com.example.animals.repository.PostSaveRepository;
import com.example.animals.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PostSaveService {

    @Autowired
    private PostSaveRepository postSaveRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void addSave(Long postId, Long userId) {
        // Проверяем, не существует ли уже сохранение
        if (postSaveRepository.existsByPostIdAndUserId(postId, userId)) {
            return; // Сохранение уже существует
        }

        // Получаем пост и пользователя
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Создаем и сохраняем сохранение
        PostSave save = new PostSave(post, user);
        postSaveRepository.save(save);
    }

    @Transactional
    public void removeSave(Long postId, Long userId) {
        Optional<PostSave> save = postSaveRepository.findByPostIdAndUserId(postId, userId);
        save.ifPresent(postSaveRepository::delete);
    }

    public boolean isPostSavedByUser(Long postId, Long userId) {
        return postSaveRepository.existsByPostIdAndUserId(postId, userId);
    }

    public int getSavesCount(Long postId) {
        return postSaveRepository.countByPostId(postId);
    }
}