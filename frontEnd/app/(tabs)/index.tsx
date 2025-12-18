import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import Post from '../../components/Post';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';

const API_BASE_URL = 'http://localhost:8080/api';

// Обновляем тип для поста чтобы соответствовать API
type PostType = {
  id: number;
  title: string;
  photoUrl: string;
  fullPhotoUrl?: string;
  userId: number;
  username: string;
  placeName: string;
  urgently: boolean; // API возвращает urgently
  createdAt: string;
  likesCount: number;
  savesCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
};

export default function HomeScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentUserId = 1;

  const handleQuestionnairePress = () => {
    router.push('/(tabs)/questionnaire');
  };

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from API...');
      const response = await fetch(`${API_BASE_URL}/posts/all-detailed`);
      const data = await response.json();
      console.log('API Response:', data);
      
      // Преобразуем данные API в нужный формат
      const formattedPosts: PostType[] = data.map((post: any) => ({
        id: post.id,
        title: post.title,
        photoUrl: post.photoUrl,
        fullPhotoUrl: post.fullPhotoUrl,
        userId: post.userId,
        username: post.username,
        placeName: post.placeName,
        urgently: post.urgently, // Обратите внимание: urgently, а не isUrgently
        createdAt: post.createdAt,
        likesCount: post.likesCount,
        savesCount: post.savesCount,
        likedByCurrentUser: post.likedByCurrentUser,
        savedByCurrentUser: post.savedByCurrentUser
      }));
      
      console.log('Formatted posts:', formattedPosts);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.log('Using fallback data');
      
      // Простые fallback данные
      const fallbackPosts: PostType[] = [
        {
          id: 1,
          title: "Найдена собака в парке",
          photoUrl: "http://localhost:8080/assets/images/posts/post1.jpg",
          userId: 1,
          username: "Mary",
          placeName: "Парк Горького",
          urgently: false,
          createdAt: "2025-12-17T14:51:40Z",
          likesCount: 1,
          savesCount: 1,
          likedByCurrentUser: false,
          savedByCurrentUser: false
        },
        {
          id: 2,
          title: "Нашел щенка возле метро",
          photoUrl: "http://localhost:8080/assets/images/posts/post2.jpg",
          userId: 1,
          username: "Mary",
          placeName: "Лосиный остров",
          urgently: false,
          createdAt: "2025-12-17T14:51:40Z",
          likesCount: 1,
          savesCount: 1,
          likedByCurrentUser: false,
          savedByCurrentUser: false
        }
      ];
      setPosts(fallbackPosts);
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
    setPosts(posts.map(post => 
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
    setPosts(posts.map(post => 
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
              onLikePress={(postId, liked) => {
                // Обновляем состояние
                setPosts(posts.map(p => 
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
                setPosts(posts.map(p => 
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