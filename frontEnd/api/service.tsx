import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8080/api';
const TOKEN_STORAGE_KEY = '@auth_token';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  description?: string;
}

interface ApiError {
  message?: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role?: string;
  description?: string | null;
  photo?: string | null;
  createdAt?: string;
}

interface LoginRequest {
  identifier: string;
  password: string;
}

// Глобальная переменная для хранения токена
let authToken: string | null = null;

class ApiService {
  constructor() {
    this.loadToken();
  }

  // Загрузка токена из хранилища
  private async loadToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        authToken = token;
        console.log('🔑 Токен загружен из хранилища');
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки токена:', error);
    }
  }

  // Сохранение токена
  async setToken(token: string | null): Promise<void> {
    authToken = token;
    if (token) {
      try {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
        console.log('🔑 Токен сохранен');
      } catch (error) {
        console.error('❌ Ошибка сохранения токена:', error);
      }
    } else {
      try {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        console.log('🔑 Токен удален');
      } catch (error) {
        console.error('❌ Ошибка удаления токена:', error);
      }
    }
  }

  // Получение текущего токена
  getToken(): string | null {
    return authToken;
  }

  // Универсальный метод для запросов с авторизацией
  private async fetchWithAuth(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен авторизации, если есть
    if (authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
    }

    console.log(`🌐 Запрос: ${options.method || 'GET'} ${url}`);
    if (authToken) {
      console.log('🔑 Используется токен авторизации');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Обработка ошибок авторизации (401)
    if (response.status === 401) {
      console.warn('⚠️ Ошибка авторизации (401)');
      // Можно добавить логику обновления токена или выхода
      await this.setToken(null);
    }

    return response;
  }

  // Регистрация
  async register(data: RegisterData): Promise<UserResponse> {
    try {
      console.log('🚀 === НАЧАЛО РЕГИСТРАЦИИ ===');
      console.log('📤 Отправляемые данные:', { ...data, password: '***' });
      
      const response = await this.fetchWithAuth(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      console.log('📥 Статус ответа:', response.status);
      const responseText = await response.text();
      
      if (!responseText.trim()) {
        throw new Error('Пустой ответ от сервера');
      }

      if (response.ok) {
        try {
          const userData = JSON.parse(responseText);
          console.log('🎉 Регистрация успешна!');
          
          // Если сервер возвращает токен при регистрации
          if (userData.token) {
            await this.setToken(userData.token);
          }
          
          return userData;
        } catch (e) {
          throw new Error('Неверный формат ответа от сервера');
        }
      } else {
        let errorMessage = responseText;
        
        try {
          const parsed = JSON.parse(responseText);
          errorMessage = parsed.message || parsed;
        } catch (e) {
          // Оставляем как текст
        }

        // Форматируем сообщения об ошибках
        if (errorMessage.includes('Email already used')) {
          errorMessage = 'Этот email уже используется';
        } else if (errorMessage.includes('Username already used')) {
          errorMessage = 'Этот username уже используется';
        }

        const error = new Error(errorMessage);
        error.name = 'RegistrationError';
        throw error;
      }
    } catch (error) {
      console.error('💥 Register error:', error);
      throw error;
    }
  }

  // Авторизация
  async login(identifier: string, password: string): Promise<UserResponse> {
    try {
      console.log('🔐 Отправка запроса на авторизацию...');
      
      const response = await this.fetchWithAuth(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      console.log('📥 Статус ответа:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Неверный логин или пароль');
      }

      const userData = await response.json();
      
      // Проверяем наличие обязательных полей
      if (!userData.id || !userData.username || !userData.email) {
        throw new Error('Неверный формат ответа от сервера');
      }

      // Если сервер возвращает токен (JWT)
      if (userData.token) {
        await this.setToken(userData.token);
      }

      // Добавляем дефолтные значения
      const normalizedUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'user',
        description: userData.description || null,
        photo: userData.photo || null,
        createdAt: userData.createdAt || new Date().toISOString()
      };

      console.log('✅ Авторизация успешна для:', normalizedUser.username);
      return normalizedUser;
      
    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    }
  }

  // Получение списка пользователей (требует авторизации)
  async getUsers(): Promise<UserResponse[]> {
    try {
      console.log('👥 Запрос списка пользователей...');
      
      const response = await this.fetchWithAuth(`${API_URL}/users`);
      
      console.log('📥 Статус:', response.status);
      
      if (response.ok) {
        const users = await response.json();
        console.log('✅ Получено пользователей:', users.length);
        return users;
      } else if (response.status === 401) {
        console.log('🔒 Требуется авторизация');
        return [];
      } else {
        const errorText = await response.text();
        console.log('❌ Ошибка получения пользователей:', errorText);
        return [];
      }
    } catch (error) {
      console.error('💥 Get users error:', error);
      return [];
    }
  }

  // Получение текущего пользователя
  async getCurrentUser(email?: string): Promise<UserResponse | null> {
    try {
      console.log('👤 Запрос данных текущего пользователя...');
      
      let url = `${API_URL}/me`;
      if (email) {
        url += `?email=${encodeURIComponent(email)}`;
      }
      
      const response = await this.fetchWithAuth(url);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Данные пользователя получены');
        return userData;
      } else {
        console.log('❌ Не удалось получить данные пользователя');
        return null;
      }
    } catch (error) {
      console.error('💥 Get current user error:', error);
      return null;
    }
  }

  // Обновление данных пользователя
  async updateUser(userId: number, data: Partial<UserResponse>): Promise<UserResponse | null> {
    try {
      console.log('✏️ Обновление данных пользователя:', userId);
      
      const response = await this.fetchWithAuth(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Данные пользователя обновлены');
        return userData;
      } else {
        const errorText = await response.text();
        console.log('❌ Ошибка обновления пользователя:', errorText);
        return null;
      }
    } catch (error) {
      console.error('💥 Update user error:', error);
      return null;
    }
  }

  // Выход (очистка токена)
  async logout(): Promise<void> {
    console.log('🚪 Выход из системы...');
    await this.setToken(null);
    console.log('✅ Токен удален');
  }
}

export const apiService = new ApiService();