// app/LoginScreen.tsx или app/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    console.log('=== ВЫЗОВ ФУНКЦИИ LOGIN ===');
    console.log('📝 Введенные данные:', { 
      identifier, 
      password: '***' + password.slice(-3) 
    });
    
    // Валидация
    if (!identifier || !password) {
      console.log('❌ Валидация: пустые поля');
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔄 Начинаем процесс авторизации...');
      
      // Используем API для авторизации
      const userData = await apiService.login(identifier, password);
      
      console.log('📊 Результат авторизации:', userData ? 'УСПЕХ' : 'НЕУДАЧА');
      
      if (userData) {
        // Успешная авторизация
        console.log('🎉 Пользователь авторизован:', userData);
        Alert.alert('Успешно', `Добро пожаловать, ${userData.username}!`);
        
        // Переходим на страницу пользователя
        console.log('➡️ Переход на /user');
        router.push('/user');
      } else {
        console.log('❌ Авторизация не удалась');
        // Ошибка уже обработана в apiService
      }
    } catch (error) {
      console.error('💥 Ошибка в handleLogin:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
      console.log('🏁 Конец процесса авторизации');
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