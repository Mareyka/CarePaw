import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GlobalStyles } from '../constants/theme';

// Тип для пользователя
interface User {
  id: string;
  username: string;
  avatar?: string;
}

// Данные рекомендуемых пользователей (пока заглушки)
const recommendedUsers: User[] = [
  { id: '1', username: '_.username._' },
  { id: '2', username: '_.username._' },
  { id: '3', username: '_.username._' },
  { id: '4', username: '_.username._' },
  { id: '5', username: '_.username._' },
  { id: '6', username: '_.username._' },
];

const UserRecomend = () => {
  const router = useRouter();

  const handleUserPress = (userId: string) => {
    console.log('Переход на страницу пользователя:', userId);
  };

  // Функция для определения цвета карточки (чередование)
  const getCardStyle = (index: number) => {
    return index % 2 === 0 
      ? GlobalStyles.bgPrimary 
      : GlobalStyles.bgQuaternary;
  };

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
          >
            <View style={styles.user_img}></View>
            <Text style={[GlobalStyles.textSpecial]} numberOfLines={1}>
              {user.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default UserRecomend;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  },
  user_img: {
    height: 76,
    width: 76,
    borderRadius: 36,
    ...GlobalStyles.bgBase,
    marginBottom: 4,
  },
});