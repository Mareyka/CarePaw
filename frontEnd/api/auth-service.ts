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

class AuthService {
  private user: User | null = null;
  private isAuthenticated = false;
  private isLoading = false;
  private listeners: Array<(state: AuthState) => void> = [];

  // Авторизация
  async login(identifier: string, password: string): Promise<User> {
    this.setLoading(true);
    
    try {
      const userResponse = await apiService.login(identifier, password);
      const user = this.normalizeUser(userResponse);
      
      this.user = user;
      this.isAuthenticated = true;
      this.notifyListeners();
      
      console.log('✅ Пользователь авторизован:', user.username);
      return user;
    } catch (error) {
      console.error('❌ Ошибка авторизации:', error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Регистрация
  async register(data: { username: string; email: string; password: string }): Promise<User> {
    this.setLoading(true);
    
    try {
      const userResponse = await apiService.register(data);
      // Автоматически авторизуем после регистрации
      return await this.login(data.email, data.password);
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Выход
  logout(): void {
    apiService.logout();
    this.user = null;
    this.isAuthenticated = false;
    this.notifyListeners();
    console.log('✅ Пользователь вышел из системы');
  }

  // Инициализация (проверка существующей сессии)
  async initialize(): Promise<void> {
    this.setLoading(true);
    
    try {
      // Пытаемся получить данные текущего пользователя
      const userResponse = await apiService.getCurrentUser();
      if (userResponse) {
        const user = this.normalizeUser(userResponse);
        this.user = user;
        this.isAuthenticated = true;
        console.log('✅ Сессия восстановлена для:', user.username);
      } else {
        console.log('📭 Нет сохраненной сессии');
      }
    } catch (error) {
      console.error('❌ Ошибка инициализации:', error);
    } finally {
      this.setLoading(false);
    }
  }

  // Обновление данных пользователя в контексте (не на сервере)
  updateUserLocal(userData: Partial<User>): void {
    if (this.user) {
      this.user = { ...this.user, ...userData };
      this.notifyListeners();
      console.log('✅ Данные пользователя обновлены локально');
    }
  }

  // Геттеры
  getCurrentUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): number | null {
    return this.user?.id || null;
  }

  // Подписка на изменения
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Приватные методы
  private setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.notifyListeners();
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

  private normalizeUser(userData: UserResponse): User {
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user',
      description: userData.description || null,
      photo: userData.photo || null,
      createdAt: userData.createdAt || new Date().toISOString()
    };
  }
}

export const authService = new AuthService();