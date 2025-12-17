import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true - требует авторизации, false - требует неавторизации
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Если требуется авторизация, но пользователь не авторизован
        console.log('🛑 Требуется авторизация, перенаправляю на логин');
        router.replace('/');
      } else if (!requireAuth && isAuthenticated) {
        // Если требуется неавторизация, но пользователь авторизован
        console.log('🛑 Пользователь уже авторизован, перенаправляю на главную');
        router.replace('/user');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A4B88C" />
      </View>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // или лоадер, пока происходит редирект
  }

  if (!requireAuth && isAuthenticated) {
    return null; // или лоадер, пока происходит редирект
  }

  return <>{children}</>;
}