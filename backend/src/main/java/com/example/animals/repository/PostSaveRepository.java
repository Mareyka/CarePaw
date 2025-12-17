package com.example.animals.repository;

import com.example.animals.model.PostSave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostSaveRepository extends JpaRepository<PostSave, Long> {
    Optional<PostSave> findByPostIdAndUserId(Long postId, Long userId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    int countByPostId(Long postId);
    List<PostSave> findByUserId(Long userId); // новый метод
}