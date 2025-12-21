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
      
      this.updateInternalState(user);
      console.log('Пользователь авторизован:', user.username);
      return user;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Регистрация
  async register(data: { username: string; email: string; password: string; description?: string }): Promise<User> {
    this.setLoading(true);
    try {
      // 1. Делаем запрос регистрации
      const userResponse = await apiService.register(data);
      const user = this.normalizeUser(userResponse);
      
      // 2. Сразу сохраняем пользователя в стейт (не вызывая login повторно)
      this.updateInternalState(user);
      
      console.log('Регистрация и вход успешны:', user.username);
      return user;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
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
    console.log('Пользователь вышел из системы');
  }

  // Упрощенная инициализация (пока просто выключает загрузку)
  async initialize(): Promise<void> {
    this.setLoading(false);
    console.log('Система авторизации инициализирована (In-Memory mode)');
  }

  // Внутренний метод для обновления стейта
  private updateInternalState(user: User): void {
    this.user = user;
    this.isAuthenticated = true;
    this.notifyListeners();
  }

  updateUserLocal(userData: Partial<User>): void {
    if (this.user) {
      this.user = { ...this.user, ...userData };
      this.notifyListeners();
    }
  }

  // Геттеры
  getCurrentUser(): User | null { return this.user; }
  isLoggedIn(): boolean { return this.isAuthenticated; }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  private getState(): AuthState {
    return { user: this.user, isAuthenticated: this.isAuthenticated, isLoading: this.isLoading };
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