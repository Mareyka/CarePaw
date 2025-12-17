package com.example.animals.controller;

import com.example.animals.dto.PostResponse;
import com.example.animals.dto.PostResponseDTO;
import com.example.animals.model.Place;
import com.example.animals.model.Post;
import com.example.animals.model.PostLike;
import com.example.animals.model.PostSave;
import com.example.animals.model.User;
import com.example.animals.repository.PlaceRepository;
import com.example.animals.repository.PostRepository;
import com.example.animals.repository.PostLikeRepository;
import com.example.animals.repository.PostSaveRepository;
import com.example.animals.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PostController {

    private final PostRepository postRepository;
    private final PlaceRepository placeRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostSaveRepository postSaveRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads";

    public PostController(PostRepository postRepository, PlaceRepository placeRepository,
                          PostLikeRepository postLikeRepository, PostSaveRepository postSaveRepository,
                          UserRepository userRepository) {
        this.postRepository = postRepository;
        this.placeRepository = placeRepository;
        this.postLikeRepository = postLikeRepository;
        this.postSaveRepository = postSaveRepository;
        this.userRepository = userRepository;
    }

    // === Существующие методы (остаются без изменений) ===

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> createPost(
            @RequestParam String title,
            @RequestParam Long placeId,
            @RequestParam boolean isUrgently,
            @RequestParam Long userId,
            @RequestParam(name = "photo", required = false) MultipartFile photo
    ) throws IOException {

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("Place not found: " + placeId));

        Post post = new Post();
        post.setTitle(title);
        post.setPlace(place);
        post.setUrgently(isUrgently);
        post.setUserId(userId);

        if (photo != null && !photo.isEmpty()) {
            String fileName = saveFile(photo);
            String photoUrl = "/uploads/" + fileName;
            post.setPhotoUrl(photoUrl);
        }

        Post saved = postRepository.save(post);

        PostResponse resp = mapToResponse(saved);
        return ResponseEntity.status(201).body(resp);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam Long placeId,
            @RequestParam boolean isUrgently,
            @RequestParam Long userId,
            @RequestParam(name = "photo", required = false) MultipartFile photo
    ) throws IOException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("Place not found: " + placeId));

        post.setTitle(title);
        post.setPlace(place);
        post.setUrgently(isUrgently);
        post.setUserId(userId);

        if (photo != null && !photo.isEmpty()) {
            String fileName = saveFile(photo);
            String photoUrl = "/uploads/" + fileName;
            post.setPhotoUrl(photoUrl);
        }

        Post saved = postRepository.save(post);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long placeId,
            @RequestParam(required = false) Boolean isUrgently
    ) {
        List<PostResponse> list = postRepository.findByFilters(userId, placeId, isUrgently).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // === Новые методы для лайков и сохранений ===

    @GetMapping("/{postId}/details")
    public ResponseEntity<PostResponseDTO> getPostWithDetails(
            @PathVariable Long postId,
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));

        return ResponseEntity.ok(mapToDetailedResponse(post, currentUserId));
    }

    @GetMapping("/all-detailed")
    public ResponseEntity<List<PostResponseDTO>> getAllDetailed(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {

        List<PostResponseDTO> list = postRepository.findAll().stream()
                .map(post -> mapToDetailedResponse(post, currentUserId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Проверяем, не лайкнул ли уже пользователь
        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            return ResponseEntity.badRequest().build();
        }

        PostLike like = new PostLike(post, user);
        postLikeRepository.save(like);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        PostLike like = postLikeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Like not found"));

        postLikeRepository.delete(like);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Integer> getLikesCount(@PathVariable Long postId) {
        int count = postLikeRepository.countByPostId(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{postId}/likes/check")
    public ResponseEntity<Boolean> checkIfLiked(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        boolean isLiked = postLikeRepository.existsByPostIdAndUserId(postId, userId);
        return ResponseEntity.ok(isLiked);
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<Void> savePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Проверяем, не сохранил ли уже пользователь
        if (postSaveRepository.existsByPostIdAndUserId(postId, userId)) {
            return ResponseEntity.badRequest().build();
        }

        PostSave save = new PostSave(post, user);
        postSaveRepository.save(save);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/save")
    public ResponseEntity<Void> unsavePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        PostSave save = postSaveRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Save not found"));

        postSaveRepository.delete(save);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}/saves/count")
    public ResponseEntity<Integer> getSavesCount(@PathVariable Long postId) {
        int count = postSaveRepository.countByPostId(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{postId}/saves/check")
    public ResponseEntity<Boolean> checkIfSaved(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {

        boolean isSaved = postSaveRepository.existsByPostIdAndUserId(postId, userId);
        return ResponseEntity.ok(isSaved);
    }

    @GetMapping("/user/{userId}/liked-posts")
    public ResponseEntity<List<PostResponseDTO>> getLikedPostsByUser(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {

        List<Post> likedPosts = postLikeRepository.findByUserId(userId).stream()
                .map(PostLike::getPost)
                .collect(Collectors.toList());

        List<PostResponseDTO> list = likedPosts.stream()
                .map(post -> mapToDetailedResponse(post, currentUserId))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/saved-posts")
    public ResponseEntity<List<PostResponseDTO>> getSavedPostsByUser(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {

        List<Post> savedPosts = postSaveRepository.findByUserId(userId).stream()
                .map(PostSave::getPost)
                .collect(Collectors.toList());

        List<PostResponseDTO> list = savedPosts.stream()
                .map(post -> mapToDetailedResponse(post, currentUserId))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // === Вспомогательные методы ===

    private String saveFile(MultipartFile file) throws IOException {
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String newName = UUID.randomUUID() + ext;

        Path uploadPath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path target = uploadPath.resolve(newName);
        file.transferTo(target.toFile());

        return newName;
    }

    private PostResponse mapToResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getPlace().getId(),
                post.getPlace().getName(),
                post.isUrgently(),
                post.getPhotoUrl(),
                post.getUserId(),
                post.getCreatedAt()
        );
    }

    private PostResponseDTO mapToDetailedResponse(Post post, Long currentUserId) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setPhotoUrl(post.getPhotoUrl());
        dto.setUserId(post.getUserId());

        // Получаем username пользователя
        User author = userRepository.findById(post.getUserId()).orElse(null);
        dto.setUsername(author != null ? author.getUsername() : "Unknown");

        dto.setPlaceName(post.getPlace() != null ? post.getPlace().getName() : null);
        dto.setUrgently(post.isUrgently());
        dto.setCreatedAt(post.getCreatedAt());

        // Получаем количество лайков и сохранений
        dto.setLikesCount(postLikeRepository.countByPostId(post.getId()));
        dto.setSavesCount(postSaveRepository.countByPostId(post.getId()));

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