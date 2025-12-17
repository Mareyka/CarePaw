import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, UserResponse } from './service';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  description?: string | null;
  photo?: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = '@auth_data';

// Функция нормализации данных
const normalizeUser = (userData: UserResponse): User => {
  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    role: userData.role || 'user',
    description: userData.description || null,
    photo: userData.photo || null,
    createdAt: userData.createdAt || new Date().toISOString()
  };
};

class AuthService {
  private user: User | null = null;
  private isAuthenticated = false;
  private isLoading = true;
  
  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    await this.loadAuthData();
    this.isLoading = false;
    this.notifyListeners();
  }

async loadAuthData(): Promise<void> {
  try {
    console.log('📂 Загрузка данных авторизации...');
    const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    
    if (authData) {
      const parsedData = JSON.parse(authData);
      
      if (parsedData.user) {
        this.user = parsedData.user;
        this.isAuthenticated = true;
        console.log('✅ Авторизация восстановлена для:', this.user?.username || 'unknown');
      }
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки авторизации:', error);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

  async login(identifier: string, password: string): Promise<User> {
    try {
      console.log('🔐 Авторизация пользователя:', identifier);
      
      // Получаем данные от API
      const userResponse = await apiService.login(identifier, password);
      
      // Нормализуем данные
      const normalizedUser = normalizeUser(userResponse);
      
      // Сохраняем
      this.user = normalizedUser;
      this.isAuthenticated = true;
      
      // Сохраняем в AsyncStorage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: normalizedUser,
        timestamp: Date.now()
      }));
      
      console.log('✅ Пользователь авторизован:', normalizedUser.username);
      this.notifyListeners();
      
      return normalizedUser;
    } catch (error) {
      console.error('❌ Ошибка авторизации:', error);
      throw error;
    }
  }

  async register(data: { username: string; email: string; password: string }): Promise<User> {
    try {
      console.log('📝 Регистрация пользователя:', data.username);
      
      // Регистрируем пользователя
      const userResponse = await apiService.register({
        username: data.username,
        email: data.email,
        password: data.password
      });
      
      // Автоматически авторизуем
      return await this.login(data.email, data.password);
      
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    console.log('🚪 Выход из системы...');
    
    this.user = null;
    this.isAuthenticated = false;
    
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('✅ Данные авторизации удалены');
    
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): number | null {
    return this.user?.id || null;
  }

  async updateUser(userData: Partial<User>): Promise<void> {
    if (!this.user) {
      throw new Error('Пользователь не авторизован');
    }
    
    // Обновляем данные
    this.user = { ...this.user, ...userData };
    
    // Сохраняем обновленные данные
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user: this.user,
      timestamp: Date.now()
    }));
    
    console.log('✅ Данные пользователя обновлены');
    this.notifyListeners();
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Вызываем сразу текущее состояние
    listener(this.getState());
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  private getState(): AuthState {
    return {
      user: this.user,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading
    };
  }

  // Для отладки
  getStateForDebug(): AuthState {
    return this.getState();
  }
}

export const authService = new AuthService();