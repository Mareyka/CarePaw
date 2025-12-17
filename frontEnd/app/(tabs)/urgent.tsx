import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Post from '../../components/Post';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Замените на ваш IP

// Тип для поста
type PostType = {
  id: number;
  title: string;
  photoUrl: string;
  userId: number;
  username: string;
  placeName: string;
  isUrgently: boolean;
  likesCount: number;
  savesCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
};

export default function UrgentScreen() {
  const [urgentPosts, setUrgentPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentUserId = 1; // Временно, пока нет авторизации

  const fetchUrgentPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`, {
        params: { isUrgently: true },
        headers: { 'X-User-Id': currentUserId.toString() }
      });
      // Преобразуем данные в формат PostResponseDTO
      const urgentPostsData: PostType[] = response.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        photoUrl: post.photoUrl,
        userId: post.userId,
        username: "Пользователь", // Временное значение
        placeName: post.placeName,
        isUrgently: post.isUrgently,
        likesCount: 0, // Временное значение
        savesCount: 0, // Временное значение
        likedByCurrentUser: false,
        savedByCurrentUser: false
      }));
      setUrgentPosts(urgentPostsData);
    } catch (error) {
      console.error('Error fetching urgent posts:', error);
      // Запасные данные для демонстрации
      const fallbackPosts: PostType[] = [
        {
          id: 1,
          title: "Срочно! Помогите найти пропавшего кота",
          photoUrl: "https://picsum.photos/400/600",
          userId: 1,
          username: "user1",
          placeName: "Центральный парк",
          isUrgently: true,
          likesCount: 124,
          savesCount: 15,
          likedByCurrentUser: false,
          savedByCurrentUser: false
        },
        {
          id: 2,
          title: "Нужна срочная помощь с передержкой",
          photoUrl: "https://picsum.photos/400/600",
          userId: 2,
          username: "user2",
          placeName: "Микрорайон Северный",
          isUrgently: true,
          likesCount: 89,
          savesCount: 7,
          likedByCurrentUser: true,
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
        {urgentPosts.map(post => (
          <Post 
            key={post.id}
            postData={post}
            currentUserId={currentUserId}
            onLikeChanged={handleLikeChanged}
            onSaveChanged={handleSaveChanged}
          />
        ))}
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECE1D1',
    paddingBottom: 52,
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
});