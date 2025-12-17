package com.example.animals.repository;

import com.example.animals.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("select p from Post p " +
            "where (:userId is null or p.userId = :userId) " +
            "and (:placeId is null or p.place.id = :placeId) " +
            "and (:isUrgently is null or p.isUrgently = :isUrgently)")
    List<Post> findByFilters(@Param("userId") Long userId,
                             @Param("placeId") Long placeId,
                             @Param("isUrgently") Boolean isUrgently);
}


