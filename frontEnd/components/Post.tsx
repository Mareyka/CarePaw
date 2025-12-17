import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlobalStyles } from '../constants/theme';
import Svg, { Path } from 'react-native-svg';

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

// Типы для пропсов
interface PostProps {
  // Вариант 1: Простые пропсы
  imageUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
  description?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onRepostPress?: () => void;
  onBookmarkPress?: () => void;
  username?: string;
  userImage?: string;
  
  // Вариант 2: Полные данные поста (для совместимости)
  postData?: {
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
  
  currentUserId?: number;
  onLikeChanged?: (postId: number, isLiked: boolean) => void;
  onSaveChanged?: (postId: number, isSaved: boolean) => void;
}

const Post = ({ 
  // Простые пропсы
  imageUrl: propImageUrl, 
  likesCount: propLikesCount = 0,
  commentsCount = 0,
  repostsCount = 0,
  description: propDescription = "Описание поста будет здесь...",
  isLiked: propIsLiked = false,
  isBookmarked: propIsBookmarked = false,
  onLikePress: propOnLikePress,
  onBookmarkPress: propOnBookmarkPress,
  username: propUsername = "_.username._",
  userImage,
  
  // Данные поста
  postData,
  currentUserId,
  onLikeChanged,
  onSaveChanged
}: PostProps) => {
  // Определяем, используем ли мы postData или простые пропсы
  const usePostData = !!postData;
  
  // Если есть postData, используем его
  const imageUrl = usePostData ? postData.photoUrl : propImageUrl;
  const username = usePostData ? postData.username : propUsername;
  const description = usePostData ? postData.title : propDescription;
  const baseLikesCount = usePostData ? postData.likesCount : propLikesCount;
  const baseIsLiked = usePostData ? postData.likedByCurrentUser : propIsLiked;
  const baseIsBookmarked = usePostData ? postData.savedByCurrentUser : propIsBookmarked;
  
  // Локальное состояние
  const [liked, setLiked] = useState(baseIsLiked);
  const [bookmarked, setBookmarked] = useState(baseIsBookmarked);
  const [currentLikesCount, setCurrentLikesCount] = useState(baseLikesCount);

  const handleLikePress = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setCurrentLikesCount(newLikedState ? currentLikesCount + 1 : currentLikesCount - 1);
    
    // Если есть postData и колбэки
    if (usePostData && onLikeChanged) {
      onLikeChanged(postData.id, newLikedState);
    }
    
    // Если есть простой колбэк
    if (propOnLikePress) {
      propOnLikePress();
    }
  };

  const handleBookmarkPress = () => {
    const newBookmarkedState = !bookmarked;
    setBookmarked(newBookmarkedState);
    
    // Если есть postData и колбэки
    if (usePostData && onSaveChanged) {
      onSaveChanged(postData.id, newBookmarkedState);
    }
    
    // Если есть простой колбэк
    if (propOnBookmarkPress) {
      propOnBookmarkPress();
    }
  };

  // Если нет URL изображения, не рендерим пост
  if (!imageUrl) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Шапка поста с пользователем */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          {userImage && (
            <Image 
              source={{ uri: userImage }} 
              style={styles.userimg}
              resizeMode="cover"
            />
          )}
          <Text style={[GlobalStyles.textSpecial]}>{username}</Text>
        </View>
      </View>

      {/* Изображение поста */}
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />

      {/* Действия (лайки, закладки) */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
            <LikeIcon filled={liked} />
            <Text style={GlobalStyles.textSpecial}>{currentLikesCount}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleBookmarkPress} style={styles.leftActions}>
          <BookmarkIcon filled={bookmarked} />
        </TouchableOpacity>
      </View>

      {/* Описание поста */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {description}
        </Text>
        {usePostData && postData.placeName && (
          <Text style={styles.placeText}>📍 {postData.placeName}</Text>
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
  descriptionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  placeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default Post;