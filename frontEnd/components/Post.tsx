import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

const API_BASE_URL = 'http://localhost:8080/api';

// Иконка лайка 
const LikeIcon = ({ filled = false }) => (
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
const BookmarkIcon = ({ filled = false }) => (
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

// Типы для пропсов
interface PostProps {
  postData?: {
    id: number;
    title?: string;
    photoUrl?: string;
    fullPhotoUrl?: string;
    userId: number;
    username?: string;
    userPhoto?: string;
    placeName?: string;
    urgently?: boolean;
    likesCount?: number;
    savesCount?: number;
    likedByCurrentUser?: boolean;
    savedByCurrentUser?: boolean;
  };
  onLikeChanged?: (postId: number, liked: boolean) => void;
  onSaveChanged?: (postId: number, saved: boolean) => void;
}

const Post = ({ 
  postData, 
  onLikeChanged,
  onSaveChanged
}: PostProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>('');

  // Функция для получения правильного URL изображения поста
  const getImageUrl = () => {
    if (!postData?.photoUrl) {
      return 'https://via.placeholder.com/400x200?text=No+Image';
    }
    
    if (postData.fullPhotoUrl) {
      return postData.fullPhotoUrl;
    }
    
    if (postData.photoUrl.startsWith('http://') || postData.photoUrl.startsWith('https://')) {
      return postData.photoUrl;
    }
    
    return `http://localhost:8080/api/images/posts/${postData.photoUrl}`;
  };

  // Функция для получения URL аватара пользователя
  const fetchUserAvatar = async () => {
    if (!postData?.userId) return;
    
    try {
      // Если в postData уже есть userPhoto, используем его
      if (postData.userPhoto) {
        const url = postData.userPhoto.startsWith('http://') || postData.userPhoto.startsWith('https://')
          ? postData.userPhoto
          : `http://localhost:8080/uploads/${postData.userPhoto}`;
        setUserAvatarUrl(url);
        return;
      }
      
      // Если нет userPhoto, пробуем получить пользователя по ID
      const response = await fetch(`${API_BASE_URL}/me?email=`, {
        headers: {
          'X-User-Id': postData.userId.toString()
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.photo) {
          const url = userData.photo.startsWith('http://') || userData.photo.startsWith('https://')
            ? userData.photo
            : `http://localhost:8080/uploads/${userData.photo}`;
          setUserAvatarUrl(url);
        }
      }
    } catch (error) {
      console.log('Could not fetch user avatar:', error);
      // Используем заглушку
      setUserAvatarUrl('https://via.placeholder.com/24');
    }
  };

  // Функция перехода на профиль пользователя
  const navigateToUserProfile = () => {
    if (postData?.userId) {
      console.log('Navigating to user profile:', postData.userId);
      router.push({
        pathname: '/user/[id]',
        params: { id: postData.userId.toString() }
      });
    } else {
      console.warn('User ID is missing in post data');
    }
  };

  // Инициализируем состояния из postData
  useEffect(() => {
    if (postData) {
      setLiked(postData.likedByCurrentUser || false);
      setLikesCount(postData.likesCount || 0);
      setSaved(postData.savedByCurrentUser || false);
      setImageError(false);
      
      // Пробуем получить аватар пользователя
      fetchUserAvatar();
    }
  }, [postData]);

  // Обработчик лайка
  const handleLikePress = async () => {
    if (!postData || !user?.id) {
      Alert.alert('Внимание', 'Войдите в аккаунт, чтобы ставить лайки');
      return;
    }
    
    try {
      setLoadingLike(true);
      const newLiked = !liked;
      
      // Оптимистичное обновление UI
      setLiked(newLiked);
      setLikesCount(newLiked ? likesCount + 1 : Math.max(0, likesCount - 1));
      
      const url = `${API_BASE_URL}/posts/${postData.id}/like`;
      const method = newLiked ? 'POST' : 'DELETE';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        }
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          console.log('Like already exists/not exists');
          return;
        }
        throw new Error(`Failed to ${newLiked ? 'like' : 'unlike'} post`);
      }
      
      if (onLikeChanged) {
        onLikeChanged(postData.id, newLiked);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Откатываем изменения
      setLiked(!liked);
      setLikesCount(liked ? likesCount + 1 : Math.max(0, likesCount - 1));
      Alert.alert('Ошибка', 'Не удалось обновить лайк');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleSavePress = async () => {
    if (!postData || !user?.id) {
      Alert.alert('Внимание', 'Войдите в аккаунт, чтобы сохранять посты');
      return;
    }
    
    try {
      setLoadingSave(true);
      const newSaved = !saved;
      
      // Оптимистичное обновление UI
      setSaved(newSaved);
      
      const url = `${API_BASE_URL}/posts/${postData.id}/save`;
      const method = newSaved ? 'POST' : 'DELETE';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        }
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          console.log('Save already exists/not exists');
          return;
        }
        throw new Error(`Failed to ${newSaved ? 'save' : 'unsave'} post`);
      }
      
      if (onSaveChanged) {
        onSaveChanged(postData.id, newSaved);
      }
    } catch (error) {
      console.error('Error handling save:', error);
      setSaved(!saved);
      Alert.alert('Ошибка', 'Не удалось обновить сохранение');
    } finally {
      setLoadingSave(false);
    }
  };

  // Если нет данных поста
  if (!postData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Не удалось загрузить пост</Text>
      </View>
    );
  }

  const imageUrl = getImageUrl();
  const username = postData.username || '_.username._';
  const description = postData.title || 'Описание поста будет здесь...';

  return (
    <View style={styles.container}>
      {/* Шапка поста с пользователем */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          {/* Аватар пользователя */}
          <TouchableOpacity onPress={navigateToUserProfile}>
            <Image 
              source={{ 
                uri: userAvatarUrl || 'https://via.placeholder.com/24',
                cache: 'force-cache'
              }} 
              style={styles.userimg}
              resizeMode="cover"
              defaultSource={require('@/assets/images/default_avatar.png')}
              onError={() => {
                // Если не удалось загрузить аватар, используем заглушку
                setUserAvatarUrl('https://via.placeholder.com/24');
              }}
            />
          </TouchableOpacity>
          
          {/* Имя пользователя - теперь кликабельное */}
          <TouchableOpacity onPress={navigateToUserProfile}>
            <Text style={styles.usernameText}>{username}</Text>
          </TouchableOpacity>
          
          {postData.urgently && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Срочно</Text>
            </View>
          )}
        </View>
      </View>

      {/* Изображение поста */}
      <Image 
        source={{ 
          uri: imageUrl,
          cache: 'force-cache'
        }} 
        style={styles.image}
        resizeMode="cover"
        onError={(e) => {
          console.log('❌ Error loading image:', {
            attemptedUrl: imageUrl,
            error: e.nativeEvent.error,
            postId: postData.id,
            photoUrlFromServer: postData.photoUrl
          });
          setImageError(true);
        }}
        onLoad={() => {
          console.log('✅ Image loaded successfully:', imageUrl);
          setImageError(false);
        }}
      />

      {/* Действия (лайки, закладки) */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={[styles.actionButton, loadingLike && styles.disabledButton]} 
            onPress={handleLikePress}
            disabled={loadingLike || !user?.id}
          >
            <LikeIcon filled={liked} />
            <Text style={styles.actionCount}>{likesCount}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={handleSavePress} 
          style={[styles.bookmarkButton, loadingSave && styles.disabledButton]}
          disabled={loadingSave || !user?.id}
        >
          <BookmarkIcon filled={saved} />
        </TouchableOpacity>
      </View>

      {/* Описание поста */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {description}
        </Text>
        {postData.placeName && (
          <Text style={styles.locationText}>📍 {postData.placeName}</Text>
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
  },
  image: {
    width: '100%',
    backgroundColor: '#fff',
    height: 200,
  },
  userimg: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookmarkButton: {
    padding: 4,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4E5B3F',
  },
  actionCount: {
    fontSize: 14,
    color: '#4E5B3F',
    fontWeight: '500',
  },
  descriptionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  urgentBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  urgentText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '600',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    padding: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Post;