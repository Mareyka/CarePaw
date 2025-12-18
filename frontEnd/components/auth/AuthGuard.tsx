// components/auth/AuthGuard.tsx
import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const route = segments[0];
    
    // Публичные маршруты (доступны без авторизации)
    const publicRoutes = ['index', 'registration'];
    
    // Защищенные маршруты (требуют авторизации)
    const protectedRoutes = [
      '(tabs)', 
      'user', 
      'clinic', 
      'new-post', 
      'chat',
      // добавьте другие защищенные маршруты если есть
    ];

    if (!isAuthenticated && protectedRoutes.includes(route)) {
      // Не авторизован на защищенной странице -> на главную (логин)
      console.log('🚫 Доступ запрещен, редирект на главную');
      router.replace('/');
    } else if (isAuthenticated && publicRoutes.includes(route)) {
      // Авторизован на публичной странице -> в приложение
      console.log('✅ Уже авторизован, редирект в приложение');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#ECE1D1'
      }}>
        <ActivityIndicator size="large" color="#A4B88C" />
      </View>
    );
  }

  return <>{children}</>;
}