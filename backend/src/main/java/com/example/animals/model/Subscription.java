package com.example.animals.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subscriptions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"follower_id", "following_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Тот, кто подписывается
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    // Тот, на кого подписываются
    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private User following;

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public void setFollowing(User following) {
        this.following = following;
    }
}
