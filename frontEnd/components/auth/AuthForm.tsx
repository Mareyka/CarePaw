import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Button from '../Button';
import OrDivider from '../ui/OrDivider';

// 1. Добавляем определение для ошибок в интерфейс
interface AuthFormProps {
  username: string;
  password: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  // Добавляем это поле:
  errors?: {
    username?: string;
    password?: string;
    general?: string;
  };
}

export default function AuthForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loading = false,
  errors = {} // 2. Деструктурируем ошибки с дефолтным пустым объектом
}: AuthFormProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Имя пользователя или email"
        value={username}
        onChangeText={onUsernameChange}
        placeholder="Введите имя пользователя или email"
        autoCapitalize="none"
        // 3. Передаем ошибку в конкретный инпут
        error={errors.username} 
      />
      
      <Input
        label="Пароль"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Введите пароль"
        secureTextEntry
        // 4. Передаем ошибку пароля
        error={errors.password}
      />

      <OrDivider text="или" />

      <Button
        title={loading ? "Вход..." : "Войти"}
        onPress={onSubmit}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});