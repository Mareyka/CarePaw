import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Input from '../ui/Input';
import Button from '../Button';
import OrDivider from '../ui/OrDivider';
import SocialButton from '../ui/SocialButton';

interface RegistrationFormProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  description?: string;
  onUsernameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  onDescriptionChange?: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  errors?: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export default function RegistrationForm({
  username,
  email,
  password,
  confirmPassword,
  description,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onDescriptionChange,
  onSubmit,
  loading = false,
  errors = {}
}: RegistrationFormProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Имя пользователя"
        value={username}
        onChangeText={onUsernameChange}
        placeholder="Введите имя пользователя"
        autoCapitalize="none"
        error={errors.username}
      />
      
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}
      
      <Input
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        placeholder="Введите email"
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email}
      />
      
      {errors.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
      )}
      
      <Input
        label="Пароль"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Введите пароль"
        secureTextEntry
        error={errors.password}
      />
      
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <Input
        label="Подтвердите пароль"
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        placeholder="Повторите пароль"
        secureTextEntry
        error={errors.confirmPassword}
      />
      
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      
      {onDescriptionChange && (
        <Input
          label="Описание (необязательно)"
          value={description || ''}
          onChangeText={onDescriptionChange}
          placeholder="Расскажите о себе"
          multiline
          numberOfLines={3}
        />
      )}

      <OrDivider text="или" />

      <View style={styles.socialContainer}>
        <SocialButton icon="f" onPress={() => {}} />
        <SocialButton icon="G" onPress={() => {}} />
      </View>
      
      <Button
        title="Зарегистрироваться"
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
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 20,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
});