package com.example.animals.service;

import com.example.animals.dto.PostResponseDTO;
import com.example.animals.model.*;
import com.example.animals.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private PostSaveRepository postSaveRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts(Long currentUserId) {
        return postRepository.findAll().stream()
                .map(post -> convertToDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponseDTO getPostById(Long postId, Long currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToDTO(post, currentUserId);
    }

    @Transactional
    public void likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Проверяем, не лайкнул ли уже пользователь
        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new RuntimeException("Post already liked");
        }

        PostLike like = new PostLike(post, user);
        postLikeRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId, Long userId) {
        PostLike like = postLikeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Like not found"));
        postLikeRepository.delete(like);
    }

    @Transactional
    public void savePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Проверяем, не сохранил ли уже пользователь
        if (postSaveRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new RuntimeException("Post already saved");
        }

        PostSave save = new PostSave(post, user);
        postSaveRepository.save(save);
    }

    @Transactional
    public void unsavePost(Long postId, Long userId) {
        PostSave save = postSaveRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Save not found"));
        postSaveRepository.delete(save);
    }

    private PostResponseDTO convertToDTO(Post post, Long currentUserId) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setPhotoUrl(post.getPhotoUrl());
        dto.setUserId(post.getUserId());

        // Здесь нужно получить username пользователя, создавшего пост
        User author = userRepository.findById(post.getUserId()).orElse(null);
        dto.setUsername(author != null ? author.getUsername() : "Unknown");

        dto.setPlaceName(post.getPlace() != null ? post.getPlace().getName() : null);
        dto.setUrgently(post.isUrgently());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikesCount(post.getLikes() != null ? post.getLikes().size() : 0);
        dto.setSavesCount(post.getSaves() != null ? post.getSaves().size() : 0);

        // Проверяем, лайкнул/сохранил ли текущий пользователь
        if (currentUserId != null) {
            dto.setLikedByCurrentUser(postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId));
            dto.setSavedByCurrentUser(postSaveRepository.existsByPostIdAndUserId(post.getId(), currentUserId));
        } else {
            dto.setLikedByCurrentUser(false);
            dto.setSavedByCurrentUser(false);
        }

        return dto;
    }
}