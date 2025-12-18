import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Определяем текущий корневой сегмент
  const rootSegment = segments[0];
  
  // Мы на публичной странице, если сегмента нет (корень '/') 
  // или если сегмент равен 'registration'
  const isAuthPage = !rootSegment || rootSegment === 'registration';

  useEffect(() => {
    // Ждем окончания загрузки (проверки сессии), прежде чем редиректить
    if (isLoading) return;

    if (!isAuthenticated && !isAuthPage) {
      // 1. Пытаемся зайти на защищенный роут без авторизации
      console.log('🚫 Доступ запрещен: редирект на Login');
      router.replace('/');
    } else if (isAuthenticated && isAuthPage) {
      // 2. Мы уже авторизованы, но зашли на Login или Registration
      console.log('✅ Авторизован: переход в основное приложение');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, rootSegment]);

  // Если идет загрузка сессии, показываем экран ожидания
  // НО не показываем его на страницах логина/регистрации, чтобы не мешать вводу
  if (isLoading && !isAuthPage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4B88C" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECE1D1',
  },
});