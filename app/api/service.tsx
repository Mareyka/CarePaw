// api/service.ts
import { Alert } from 'react-native';

const API_URL = 'http://localhost:8080/api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
}

class ApiService {
  // Регистрация
  async register(data: RegisterData): Promise<UserResponse | null> {
    try {
      console.log('🚀 === НАЧАЛО РЕГИСТРАЦИИ ===');
      console.log('📤 Отправляемые данные:', data);
      console.log('🌐 URL:', `${API_URL}/register`);
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📥 Статус ответа:', response.status);
      const text = await response.text();
      console.log('📥 Тело ответа:', text);
      
      let result;
      try {
        result = JSON.parse(text);
        console.log('✅ Ответ (JSON):', result);
      } catch (e) {
        result = text;
        console.log('⚠️ Ответ (текст):', result);
      }

      if (response.ok) {
        console.log('🎉 Регистрация успешна!');
        return result;
      } else {
        console.log('❌ Ошибка регистрации');
        Alert.alert('Ошибка регистрации', result || 'Неизвестная ошибка');
        return null;
      }
    } catch (error) {
      console.error('💥 Register error:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
      return null;
    }
  }

  // Авторизация по username ИЛИ email
  async login(identifier: string, password: string): Promise<UserResponse | null> {
    try {
      console.log('🚀 === НАЧАЛО АВТОРИЗАЦИИ ===');
      console.log('🔑 Идентификатор (username/email):', identifier);
      console.log('🔒 Пароль:', '***' + password.slice(-3)); // скрываем пароль в логах
      
      // Определяем что ввел пользователь
      const isEmail = identifier.includes('@');
      console.log('📧 Это email?', isEmail);
      
      let requestData;
      if (isEmail) {
        // Если ввели email - отправляем как есть
        requestData = {
          email: identifier,
          password: password
        };
      } else {
        // Если ввели username - генерируем email
        const email = `${identifier}@gmail.com`;
        requestData = {
          email: email,
          password: password
        };
        console.log('🔤 Сгенерированный email:', email);
      }
      
      console.log('📤 Отправляемые данные:', { 
        ...requestData, 
        password: '***' + password.slice(-3) 
      });
      console.log('🌐 URL:', `${API_URL}/login`);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Статус ответа:', response.status);
      const text = await response.text();
      console.log('📥 Тело ответа:', text);
      
      let result;
      try {
        result = JSON.parse(text);
        console.log('✅ Ответ (JSON):', result);
      } catch (e) {
        result = text;
        console.log('⚠️ Ответ (текст):', result);
      }

      if (response.ok) {
        console.log('🎉 Авторизация успешна!');
        console.log('👤 Данные пользователя:', result);
        return result;
      } else {
        console.log('❌ Ошибка авторизации');
        Alert.alert('Ошибка авторизации', result || 'Неверный логин или пароль');
        return null;
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
      return null;
    }
  }

  // Получение списка пользователей
  async getUsers(): Promise<UserResponse[]> {
    try {
      console.log('👥 Запрос списка пользователей...');
      const response = await fetch(`${API_URL}/users`);
      
      console.log('📥 Статус:', response.status);
      
      if (response.ok) {
        const users = await response.json();
        console.log('✅ Получено пользователей:', users.length);
        return users;
      } else {
        console.log('❌ Ошибка получения пользователей');
        return [];
      }
    } catch (error) {
      console.error('💥 Get users error:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();