package com.example.animals.controller;

import com.example.animals.dto.PostResponse;
import com.example.animals.model.Place;
import com.example.animals.model.Post;
import com.example.animals.repository.PlaceRepository;
import com.example.animals.repository.PostRepository;
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

    private static final String UPLOAD_DIR = "uploads";

    public PostController(PostRepository postRepository, PlaceRepository placeRepository) {
        this.postRepository = postRepository;
        this.placeRepository = placeRepository;
    }

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
}


