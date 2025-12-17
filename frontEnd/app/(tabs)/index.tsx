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

// Определяем тип для поста
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

export default function HomeScreen() {
  const router = useRouter();
  // Явно указываем тип данных для posts
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentUserId = 1;

  const handleQuestionnairePress = () => {
    router.push('/(tabs)/questionnaire');
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/all-detailed`);
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.log('Using fallback data');
      // Простые fallback данные
      const fallbackPosts: PostType[] = [
        {
          id: 1,
          title: "Найдена собака в парке",
          photoUrl: "https://picsum.photos/400/600",
          userId: 1,
          username: "user1",
          placeName: "Центральный парк",
          isUrgently: false,
          likesCount: 24,
          savesCount: 5,
          likedByCurrentUser: false,
          savedByCurrentUser: false
        },
        {
          id: 2,
          title: "Пропал кот",
          photoUrl: "https://picsum.photos/400/600",
          userId: 2,
          username: "user2",
          placeName: "Микрорайон Восточный",
          isUrgently: true,
          likesCount: 89,
          savesCount: 12,
          likedByCurrentUser: true,
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
        {posts.map(post => (
          <Post 
            key={post.id}
            postData={post}
            currentUserId={currentUserId}
          />
        ))}

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
    paddingBottom: 52,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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