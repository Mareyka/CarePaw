import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RegistrationForm from '../components/auth/RegistrationForm';
import TabHeader from '../components/ui/TabHeader';
import { apiService } from '../api/service';

export default function RegistrationScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Добавляем поле email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState(''); // Опциональное поле
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const router = useRouter();

  const handleRegistration = async () => {
    console.log('=== Начало регистрации ===');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Сброс ошибок
    setErrors({});
    
    // Валидация на клиенте
    const newErrors: typeof errors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!password) {
      newErrors.password = 'Введите пароль';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      console.log('Отправка запроса к API...');
      
      const registerData = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        description: description.trim() || undefined
      };

      await register({
        username: username.trim(),
        email: email.trim(),
        password: password
      });
      
      const userData = await apiService.register(registerData);

      console.log('Ответ от API:', userData);
      
      if (userData) {
        console.log('Регистрация успешна!');
        // Очищаем форму
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDescription('');
        
        // Переходим на главную страницу или страницу логина
        router.replace('/clinic'); 
      }
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);
      
      // Обработка ошибок от сервера
      if (error.fields) {
        setErrors({
          username: error.fields.username?.[0] || error.fields.username,
          email: error.fields.email?.[0] || error.fields.email,
          password: error.fields.password?.[0] || error.fields.password,
        });
      } else if (error.message.includes('Email already used')) {
        setErrors({ email: 'Этот email уже используется' });
      } else if (error.message.includes('Username already used')) {
        setErrors({ username: 'Этот username уже используется' });
      } else {
        setErrors({ general: error.message || 'Не удалось зарегистрироваться' });
      }
    } finally {
      setLoading(false);
      console.log('=== Конец регистрации ===');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.greenSection}>
        <TabHeader
          tabs={[
            {
              label: 'Авторизация',
              isActive: false,
              onPress: () => router.push('/')
            },
            {
              label: 'Регистрация',
              isActive: true,
              onPress: () => {}
            }
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <RegistrationForm
          username={username}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          description={description}
          onUsernameChange={(text) => {
            setUsername(text);
            if (errors.username) setErrors({...errors, username: undefined});
          }}
          onEmailChange={(text) => {
            setEmail(text);
            if (errors.email) setErrors({...errors, email: undefined});
          }}
          onPasswordChange={(text) => {
            setPassword(text);
            if (errors.password) setErrors({...errors, password: undefined});
            if (errors.confirmPassword && text === confirmPassword) {
              setErrors({...errors, confirmPassword: undefined});
            }
          }}
          onConfirmPasswordChange={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
          }}
          onDescriptionChange={setDescription}
          onSubmit={handleRegistration}
          loading={loading}
          errors={errors}
        />

        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <TouchableOpacity 
          style={styles.loginContainer}
          onPress={() => router.push('/')}
        >
          <Text style={styles.loginText}>Уже есть аккаунт? Войти</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE1D1', 
  },
  greenSection: {
    backgroundColor: '#A4B88C', 
    paddingTop: 60, 
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
    backgroundColor: '#ECE1D1',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#5D684F',
    fontSize: 16,
  },
  errorText: {
    color: '#C0392B',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
});