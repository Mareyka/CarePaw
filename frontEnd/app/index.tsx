// app/LoginScreen.tsx или app/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AuthForm from '../components/auth/AuthForm';
import TabHeader from '../components/ui/TabHeader';
import { apiService } from '../api/service';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState(''); // может быть username или email
  const [authError, setAuthError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const [errors, setErrors] = useState<{
  username?: string;
  password?: string;
  general?: string;
}>({});



 const handleLogin = async () => {
  console.log('=== ВЫЗОВ ФУНКЦИИ LOGIN ===');
  console.log('📝 Введенные данные:', { 
    identifier, 
    password: '***' + password.slice(-3) 
  });
  
  // Сброс ошибок
  setErrors({});
  setAuthError(null);
  
  // Валидация
  if (!identifier.trim()) {
    setErrors({ username: 'Введите email или username' });
    return;
  }
  
  if (!password) {
    setErrors({ password: 'Введите пароль' });
    return;
  }

  setLoading(true);
  
   try {
      await login(identifier, password);

      const userData = apiService.getCurrentUserFromMemory();
      
      // Успешная авторизация
      if (userData && userData.id) {
        console.log('✅ Переход в профиль пользователя ID:', userData.id);
        // 3. Используем динамический роут
        router.replace(`/user/${userData.id}` as any);
      } else {
      // Фолбэк на случай, если ID почему-то не пришел
      router.replace('/(tabs)'); 
    }
    } catch (error: any) {
      console.error('Ошибка авторизации:', error);
      
      if (error.message.includes('Invalid credentials')) {
        setErrors({
          general: 'Неверный логин или пароль'
        });
      } else {
        setErrors({
          general: error.message || 'Ошибка авторизации'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.greenSection}>
        <TabHeader
          tabs={[
            {
              label: 'Авторизация',
              isActive: true,
              onPress: () => console.log('Переход на авторизацию')
            },
            {
              label: 'Регистрация',
              isActive: false,
              onPress: () => {
                console.log('➡️ Переход на регистрацию');
                router.push('/registration');
              }
            }
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <AuthForm
          username={identifier}
          password={password}
          onUsernameChange={(text) => {
            console.log('📝 Изменение идентификатора:', text);
            setIdentifier(text);
          }}
          onPasswordChange={(text) => {
            console.log('🔑 Изменение пароля:', '***' + text.slice(-3));
            setPassword(text);
          }}
          onSubmit={handleLogin}
          loading={loading}
          
        />
        {authError && (
        <Text style={styles.errorText}>{authError}</Text>
        )}
        <TouchableOpacity 
          style={styles.registerContainer}
          onPress={() => {
            console.log('➡️ Переход на регистрацию из кнопки');
            router.push('/registration');
          }}
        >
          <Text style={styles.registerText}>Нет аккаунта? Зарегистрироваться</Text>
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
  errorText: {
  color: '#C0392B',
  marginTop: 12,
  textAlign: 'center',
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
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#5D684F',
    fontSize: 16,
  },
});