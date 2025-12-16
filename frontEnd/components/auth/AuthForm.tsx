// AuthForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Button from '../Button';
import OrDivider from '../ui/OrDivider';

interface AuthFormProps {
  username: string;
  password: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function AuthForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loading = false
}: AuthFormProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Имя пользователя или email"  // Уточнили label
        value={username}
        onChangeText={onUsernameChange}
        placeholder="Введите имя пользователя или email"
        autoCapitalize="none"
        
      />
      
      <Input
        label="Пароль"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Введите пароль"
        secureTextEntry
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