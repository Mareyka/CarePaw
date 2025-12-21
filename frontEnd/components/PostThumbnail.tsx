import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, View } from 'react-native';

// Рассчитываем ширину одной ячейки (экран делим на 3)
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

interface PostThumbnailProps {
  photoUrl: string;
  onPress: () => void;
}

const PostThumbnail = ({ photoUrl, onPress }: PostThumbnailProps) => {
  // Логика формирования URL (такая же, как в твоем основном компоненте Post)
  const imageUrl = photoUrl?.startsWith('http') 
    ? photoUrl 
    // : `http://10.0.2.2:8080/api/images/posts/${photoUrl}`;
    : `http://localhost:8080/api/images/posts/${photoUrl}`;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image} 
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH, // Строго квадрат
    padding: 1, // Создает тонкую "сетку" между фотографиями
  },
  image: {
    flex: 1, // Занимает всё пространство контейнера
    backgroundColor: '#F0EAD6', // Плейсхолдер, пока грузится фото
  },
});

export default PostThumbnail;