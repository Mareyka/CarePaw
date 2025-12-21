import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "@/contexts/AuthContext";
import { GlobalStyles } from '../constants/theme';

const API_BASE_URL = 'http://localhost:8080/api';

interface User {
  id: number;
  username: string;
  photo?: string;
  role?: string;
  description?: string;
}

const UserRecomend = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки рекомендованных пользователей
  const fetchRecommendedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Если пользователь авторизован, добавляем его ID в заголовок
      if (currentUser?.id) {
        headers['X-User-Id'] = currentUser.id.toString();
      }
      
      const response = await fetch(`${API_BASE_URL}/recommendations/users?limit=6`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Преобразуем данные в нужный формат
      const formattedUsers: User[] = data.map((user: any) => ({
        id: user.id || 0,
        username: user.username || 'Пользователь',
        photo: user.photo || '',
        role: user.role || 'user',
        description: user.description || ''
      }));
      
      setRecommendedUsers(formattedUsers);
      
    } catch (error) {
      console.error('Ошибка загрузки рекомендаций:', error);
      setError('Не удалось загрузить рекомендации');
      
      const fallbackUsers: User[] = [
        { id: 1, username: 'Ветклиника ЗооМир', role: 'CLINIC' },
        { id: 2, username: 'Приют Дружок', role: 'SHELTER' },
        { id: 3, username: 'Мария Вет' },
        { id: 4, username: 'Александр К' },
      ];
      setRecommendedUsers(fallbackUsers);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем пользователей при монтировании
  useEffect(() => {
    fetchRecommendedUsers();
  }, []);

  const handleUserPress = (userId: number) => {
    console.log('Переход на страницу пользователя:', userId);
    router.push({
      pathname: "/user/[id]",
      params: { id: userId.toString() }
    });
  };

  // Функция для определения цвета карточки (чередование)
  const getCardStyle = (index: number) => {
    return index % 2 === 0 
      ? GlobalStyles.bgPrimary 
      : GlobalStyles.bgQuaternary;
  };

  // Функция для получения URL аватара
  const getAvatarUrl = (photo?: string) => {
    if (photo && photo.trim() !== '') {
      if (photo.startsWith('http://') || photo.startsWith('https://')) {
        return photo;
      }
      return `http://localhost:8080/uploads/${photo}`;
    }
    return '';
  };

  if (loading && recommendedUsers.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <View 
              key={index}
              style={[styles.userCard, getCardStyle(index)]}
            >
              <ActivityIndicator size="small" color="#4E5B3F" />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendedUsers.map((user, index) => (
          <TouchableOpacity 
            key={user.id}
            style={[styles.userCard, getCardStyle(index)]}
            onPress={() => handleUserPress(user.id)}
            activeOpacity={0.7}
          >
            <View style={styles.user_img}>
              {getAvatarUrl(user.photo) ? (
                <Image 
                  source={{ uri: getAvatarUrl(user.photo) }}
                  style={styles.userAvatar}
                  defaultSource={require('@/assets/images/default_avatar.png')}
                />
              ) : (
                <View style={[
                  styles.defaultAvatar,
                  user.role === 'CLINIC' ? styles.clinicAvatar :
                  user.role === 'SHELTER' ? styles.shelterAvatar :
                  styles.userAvatarDefault
                ]}>
                  <Text style={styles.avatarInitial}>
                    {user.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={[GlobalStyles.textSpecial, styles.username]} numberOfLines={1}>
              {user.username}
            </Text>
            
            {(user.role === 'CLINIC' || user.role === 'SHELTER') && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {user.role === 'CLINIC' ? 'Ветклиника' : 'Приют'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchRecommendedUsers} style={styles.retryButton}>
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserRecomend;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  scrollContent: {
    paddingRight: 16,
  },
  userCard: {
    height: 124,
    width: 124,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  user_img: {
    height: 76,
    width: 76,
    borderRadius: 36,
    backgroundColor: '#D0C7BA',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  defaultAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicAvatar: {
    backgroundColor: '#4E5B3F', 
  },
  shelterAvatar: {
    backgroundColor: '#697C44', 
  },
  userAvatarDefault: {
    backgroundColor: '#D0C7BA', 
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 100,
  },
  roleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(78, 91, 63, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(236, 225, 209, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4E5B3F',
    borderRadius: 6,
  },
  retryText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});