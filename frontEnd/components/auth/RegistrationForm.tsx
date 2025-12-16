import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Button from '../Button';
import OrDivider from '../ui/OrDivider';
import SocialButton from '../ui/SocialButton';

interface RegistrationFormProps {
  username: string;
  password: string;
  confirmPassword: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function RegistrationForm({
  username,
  password,
  confirmPassword,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  loading = false
}: RegistrationFormProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Имя пользователя"
        value={username}
        onChangeText={onUsernameChange}
        placeholder="Введите имя пользователя"
        autoCapitalize="none"
      />
      
      <Input
        label="Пароль"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Введите пароль"
        secureTextEntry
      />

      <Input
        label="Подтвердите пароль"
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        placeholder="Повторите пароль"
        secureTextEntry
      />

      <OrDivider text="или" />

      <View style={styles.socialContainer}>
        <SocialButton icon="f" onPress={() => {}} />
        <SocialButton icon="G" onPress={() => {}} />
      </View>
      
       <Button
        title="Зарегистрироваться"
        onPress={onSubmit}
        loading={loading}
      />
      
    </View>
  );
}

// Стили без изменений

// Стили без изменений

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 20,
  },
  
});