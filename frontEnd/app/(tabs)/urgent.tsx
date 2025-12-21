import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Post from '../../components/Post';

const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'http://10.0.2.2:8080/api';

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
  const { user } = useAuth(); 
  const [urgentPosts, setUrgentPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUrgentPosts = async () => {
    try {
      console.log('Fetching urgent posts from API...');
      
      // Подготавливаем заголовки
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Если пользователь авторизован, добавляем его ID в заголовок
      if (user?.id) {
        headers['X-User-Id'] = user.id.toString();
        console.log('Adding X-User-Id header:', user.id);
      } else {
        console.log('User not authenticated, fetching posts without user context');
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/all-detailed`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('All posts from API:', data.length, 'posts');
      
      // Фильтруем только срочные посты
      const urgentData = data.filter((post: any) => post.urgently === true);
      console.log('Filtered urgent posts:', urgentData.length, 'posts');
      
      // Преобразуем данные API в нужный формат
      const formattedPosts: PostType[] = urgentData.map((post: any) => ({
        id: post.id,
        title: post.title || 'Без названия',
        photoUrl: post.photoUrl || '',
        fullPhotoUrl: post.fullPhotoUrl || undefined, // Если fullPhotoUrl null, не используем photoUrl, пусть фронтенд сам формирует URL
        userId: post.userId || 0,
        username: post.username || 'Неизвестный',
        placeName: post.placeName || 'Местоположение не указано',
        urgently: post.urgently || false,
        createdAt: post.createdAt || new Date().toISOString(),
        likesCount: post.likesCount || 0,
        savesCount: post.savesCount || 0,
        likedByCurrentUser: post.likedByCurrentUser || false,
        savedByCurrentUser: post.savedByCurrentUser || false
      }));
      
      console.log('Formatted urgent posts:', formattedPosts);
      setUrgentPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching urgent posts:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить посты');
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

  // Обработчик изменения лайка
  const handleLikeChanged = (postId: number, liked: boolean) => {
    setUrgentPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likedByCurrentUser: liked,
              likesCount: liked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
            }
          : post
      )
    );
  };

  // Обработчик изменения сохранения
  const handleSaveChanged = (postId: number, saved: boolean) => {
    setUrgentPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              savedByCurrentUser: saved,
              savesCount: saved ? post.savesCount + 1 : Math.max(0, post.savesCount - 1)
            }
          : post
      )
    );
  };

  // Загружаем посты при изменении user
  useEffect(() => {
    loadPosts();
  }, [user?.id]); // Перезагружаем посты при изменении ID пользователя

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
              onLikeChanged={handleLikeChanged}
              onSaveChanged={handleSaveChanged}
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