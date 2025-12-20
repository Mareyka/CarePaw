import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  ActivityIndicator, 
  RefreshControl,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext'; // Импортируем useAuth
import Header from '../../components/Header';
import Post from '../../components/Post';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';

const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'http://10.0.2.2:8080/api';

// Обновляем тип для поста чтобы соответствовать API
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

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Используем user из контекста
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleQuestionnairePress = () => {
    router.push('/(tabs)/questionnaire');
  };

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from API...');
      
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
      console.log('API Response:', data.length, 'posts');
      
      // Преобразуем данные API в нужный формат
      const formattedPosts: PostType[] = data.map((post: any) => ({
        id: post.id,
        title: post.title || 'Без названия',
        photoUrl: post.photoUrl || '',
        fullPhotoUrl: post.fullPhotoUrl || undefined,
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
      
      console.log('Formatted posts:', formattedPosts.length, 'posts');
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить посты');
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    await fetchPosts();
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLikeChanged = (postId: number, isLiked: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likedByCurrentUser: isLiked,
              likesCount: isLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1)
            }
          : post
      )
    );
  };

  const handleSaveChanged = (postId: number, isSaved: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              savedByCurrentUser: isSaved,
              savesCount: isSaved ? (post.savesCount || 0) + 1 : Math.max(0, (post.savesCount || 0) - 1)
            }
          : post
      )
    );
  };

  // Загружаем посты при изменении user
  useEffect(() => {
    // Не ждем загрузки - можно сразу загружать посты
    loadPosts();
  }, [user?.id]); // Перезагружаем посты при изменении ID пользователя

  if (loading && posts.length === 0) {
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
        {posts.length === 0 ? (
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>Нет постов для отображения</Text>
          </View>
        ) : (
          posts.map(post => (
            <Post 
              key={post.id}
              postData={post}
              onLikeChanged={handleLikeChanged}
              onSaveChanged={handleSaveChanged}
            />
          ))
        )}

        <View style={styles.questionBlock}>
          <Text style={[GlobalStyles.textSpecial, styles.questiontext]}>
            Рекомендуемые страницы
          </Text>
          <UserRecomend/>
        </View>

        <View style={styles.questionBlock}>
          <Text style={[GlobalStyles.textSpecial, styles.questiontext]}>
            С вашим питомцем что-то случилось?
          </Text>
          <Button 
            title="Пройти опрос"
            onPress={handleQuestionnairePress}
            style={styles.questionButton}
          />
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...GlobalStyles.bgBase,
  },
  content: {
    flex: 1,
    paddingBottom: 32,
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
    fontSize: 16,
    color: '#666',
  },
  questionBlock: {
    width: '100%' ,
    height: 'auto',
    paddingHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  questiontext:{
    ...GlobalStyles.textSpecial,
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 12,
  },
  questionButton: {
    minWidth: 120,
  },
});