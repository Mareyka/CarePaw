import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { GlobalStyles } from '../constants/theme';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';

// Настройка базового URL
const API_BASE_URL = 'http://localhost:8080/api'; // Замените на ваш IP

// Типы для TypeScript
type PostData = {
  id: number;
  title: string;
  photoUrl: string;
  userId: number;
  username: string;
  placeName?: string;
  isUrgently: boolean;
  likesCount: number;
  savesCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
};

type PostProps = {
  postData: PostData;
  currentUserId?: number;
  onLikeChanged?: (postId: number, isLiked: boolean) => void;
  onSaveChanged?: (postId: number, isSaved: boolean) => void;
};

// Иконка лайка 
const LikeIcon = ({ filled = false }: { filled?: boolean }) => (
  <Svg width="20" height="18" viewBox="0 0 20 18" fill={filled ? "#4E5B3F" : "none"}>
    <Path 
      d="M2.3314 9.04738L10 17L17.6686 9.04738C18.5211 8.16332 19 6.96429 19 5.71405C19 3.11055 16.9648 1 14.4543 1C13.2487 1 12.0925 1.49666 11.24 2.38071L10 3.66667L8.75997 2.38071C7.90749 1.49666 6.75128 1 5.54569 1C3.03517 1 1 3.11055 1 5.71405C1 6.96429 1.47892 8.16332 2.3314 9.04738Z" 
      stroke="#4E5B3F" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Иконка закладки (сохранения)
const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#4E5B3F" : "none"}>
    <Path 
      d="M21 18V6H7.99997L2.70708 11.2929C2.31655 11.6834 2.31655 12.3166 2.70708 12.7071L7.99997 18H21Z" 
      stroke="#4E5B3F" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 12C12 13.1046 11.1045 14 9.99997 14C8.8954 14 7.99997 13.1046 7.99997 12C7.99997 10.8954 8.8954 10 9.99997 10C11.1045 10 12 10.8954 12 12Z" 
      stroke="#4E5B3F" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Основной компонент
const Post = ({ postData, currentUserId = 1, onLikeChanged, onSaveChanged }: PostProps) => {
  const [post, setPost] = useState<PostData>(postData);
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLikePress = async () => {
    if (!post || liking) return;
    
    try {
      setLiking(true);
      const newLikedState = !post.likedByCurrentUser;
      
      if (newLikedState) {
        await axios.post(`${API_BASE_URL}/posts/${post.id}/like`, {}, {
          headers: { 'X-User-Id': currentUserId.toString() }
        });
        setPost({
          ...post,
          likedByCurrentUser: true,
          likesCount: post.likesCount + 1
        });
      } else {
        await axios.delete(`${API_BASE_URL}/posts/${post.id}/like`, {
          headers: { 'X-User-Id': currentUserId.toString() }
        });
        setPost({
          ...post,
          likedByCurrentUser: false,
          likesCount: post.likesCount - 1
        });
      }
      
      // Вызываем колбэк если передан
      if (onLikeChanged) {
        onLikeChanged(post.id, newLikedState);
      }
    } catch (error) {
      console.log('Error toggling like:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleBookmarkPress = async () => {
    if (!post || saving) return;
    
    try {
      setSaving(true);
      const newSavedState = !post.savedByCurrentUser;
      
      if (newSavedState) {
        await axios.post(`${API_BASE_URL}/posts/${post.id}/save`, {}, {
          headers: { 'X-User-Id': currentUserId.toString() }
        });
        setPost({
          ...post,
          savedByCurrentUser: true,
          savesCount: post.savesCount + 1
        });
      } else {
        await axios.delete(`${API_BASE_URL}/posts/${post.id}/save`, {
          headers: { 'X-User-Id': currentUserId.toString() }
        });
        setPost({
          ...post,
          savedByCurrentUser: false,
          savesCount: post.savesCount - 1
        });
      }
      
      // Вызываем колбэк если передан
      if (onSaveChanged) {
        onSaveChanged(post.id, newSavedState);
      }
    } catch (error) {
      console.log('Error toggling save:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4E5B3F" />
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Пост не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Шапка поста с пользователем */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
            <Image 
              source={{ uri: post.photoUrl || 'https://via.placeholder.com/50' }} 
              style={styles.userimg}
              resizeMode="cover"
            />
          <Text style={[GlobalStyles.textSpecial]}>{post.username || 'Пользователь'}</Text>
          {post.isUrgently && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Срочно!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Изображение поста */}
      {post.photoUrl && (
        <Image 
          source={{ uri: post.photoUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Действия (лайки, закладки) */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLikePress}
            disabled={liking}
          >
            <LikeIcon filled={post.likedByCurrentUser} />
            <Text style={GlobalStyles.textSpecial}>{post.likesCount}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={handleBookmarkPress} 
          style={styles.leftActions}
          disabled={saving}
        >
          <BookmarkIcon filled={post.savedByCurrentUser} />
          {post.savesCount > 0 && (
            <Text style={[GlobalStyles.textSpecial, { marginLeft: 4 }]}>
              {post.savesCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Заголовок и место */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.titleText}>{post.title}</Text>
        {post.placeName && (
          <Text style={styles.placeText}>📍 {post.placeName}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  userimg: {
    width: 32,
    height: 32,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginRight: 8,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  placeText: {
    fontSize: 14,
    color: '#666',
  },
  urgentBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  urgentText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});

export default Post;