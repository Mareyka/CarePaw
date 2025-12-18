import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Post from '../../components/Post';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Обновляем тип для поста
type PostType = {
  id: number;
  title: string;
  photoUrl: string;
  fullPhotoUrl?: string;
  userId: number;
  username: string;
  placeName: string;
  urgently: boolean;
  createdAt: string;
  likesCount: number;
  savesCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
};

export default function UrgentScreen() {
  const [urgentPosts, setUrgentPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentUserId = 1;

  const fetchUrgentPosts = async () => {
    try {
      console.log('Fetching urgent posts from API...');
      const response = await fetch(`${API_BASE_URL}/posts/all-detailed`);
      const data = await response.json();
      console.log('All posts from API:', data);
      
      // Фильтруем только срочные посты
      const urgentData = data.filter((post: any) => post.urgently === true);
      console.log('Filtered urgent posts:', urgentData);
      
      // Преобразуем данные API в нужный формат
      const formattedPosts: PostType[] = urgentData.map((post: any) => ({
        id: post.id,
        title: post.title,
        photoUrl: post.photoUrl,
        fullPhotoUrl: post.fullPhotoUrl,
        userId: post.userId,
        username: post.username,
        placeName: post.placeName,
        urgently: post.urgently,
        createdAt: post.createdAt,
        likesCount: post.likesCount,
        savesCount: post.savesCount,
        likedByCurrentUser: post.likedByCurrentUser,
        savedByCurrentUser: post.savedByCurrentUser
      }));
      
      console.log('Formatted urgent posts:', formattedPosts);
      setUrgentPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching urgent posts:', error);
      
      // Запасные данные для демонстрации
      const fallbackPosts: PostType[] = [
        {
          id: 1,
          title: "Срочно! Помогите найти пропавшего кота",
          photoUrl: "http://localhost:8080/assets/images/posts/post1.jpg",
          userId: 1,
          username: "Mary",
          placeName: "Парк Горького",
          urgently: true,
          createdAt: "2025-12-17T14:51:40Z",
          likesCount: 124,
          savesCount: 15,
          likedByCurrentUser: false,
          savedByCurrentUser: false
        }
      ];
      setUrgentPosts(fallbackPosts);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    await fetchUrgentPosts();
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUrgentPosts();
    setRefreshing(false);
  };

  const handleLikeChanged = (postId: number, isLiked: boolean) => {
    setUrgentPosts(urgentPosts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likedByCurrentUser: isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
          }
        : post
    ));
  };

  const handleSaveChanged = (postId: number, isSaved: boolean) => {
    setUrgentPosts(urgentPosts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            savedByCurrentUser: isSaved,
            savesCount: isSaved ? post.savesCount + 1 : post.savesCount - 1
          }
        : post
    ));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading && urgentPosts.length === 0) {
    return (
      <View style={styles.safeArea}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E5B3F" />
        </View>
        <TabBar />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4E5B3F']}
          />
        }
      >
        {urgentPosts.length === 0 ? (
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>Нет срочных постов</Text>
            <Text style={styles.noPostsSubtext}>
              Все животные в безопасности!
            </Text>
          </View>
        ) : (
          urgentPosts.map(post => (
            <Post 
              key={post.id}
              postData={post}
              onLikePress={(postId, liked) => {
                // Обновляем состояние
                setUrgentPosts(urgentPosts.map(p => 
                  p.id === postId 
                    ? { 
                        ...p, 
                        likedByCurrentUser: liked,
                        likesCount: liked ? p.likesCount + 1 : p.likesCount - 1
                      }
                    : p
                ));
                
                // Здесь можно добавить API запрос
                console.log(`Post ${postId} ${liked ? 'liked' : 'unliked'}`);
              }}
              onBookmarkPress={(postId, saved) => {
                // Обновляем состояние
                setUrgentPosts(urgentPosts.map(p => 
                  p.id === postId 
                    ? { 
                        ...p, 
                        savedByCurrentUser: saved,
                        savesCount: saved ? p.savesCount + 1 : p.savesCount - 1
                      }
                    : p
                ));
                
                // Здесь можно добавить API запрос
                console.log(`Post ${postId} ${saved ? 'saved' : 'unsaved'}`);
              }}
            />
          ))
        )}
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECE1D1',
  },
  content: {
    flex: 1,
    paddingBottom: 52,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noPostsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4E5B3F',
    marginBottom: 8,
  },
  noPostsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});