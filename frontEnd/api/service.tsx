import { Alert } from 'react-native';

const API_URL = 'http://localhost:8080/api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  description?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role?: string;
  description?: string | null;
  photo?: string | null;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
}

class ApiService {
  // Данные пользователя храним в памяти для текущей сессии
  private currentUser: UserResponse | null = null;

  // Вспомогательный метод для обработки ошибок сервера
  private async handleError(response: Response) {
    const responseText = await response.text();
    let message = 'Произошла ошибка';

    try {
      // Пытаемся распарсить JSON, если сервер прислал его (например, { "message": "..." })
      const parsed = JSON.parse(responseText);
      message = parsed.message || parsed;
    } catch (e) {
      // Если это просто строка (как "Email already used")
      message = responseText;
    }

    // Локализация стандартных ошибок бэкенда
    if (message.includes('Email already used')) message = 'Этот email уже зарегистрирован';
    if (message.includes('Username already used')) message = 'Это имя пользователя уже занято';
    if (message.includes('Invalid credentials')) message = 'Неверный логин или пароль';
    if (message === 'Unauthorized') message = 'Ошибка авторизации';

    const error = new Error(message);
    // Добавляем флаг, чтобы в UI понимать, что это ошибка валидации/логики
    (error as any).isApiError = true;
    throw error;
  }

  // Регистрация
  async register(data: RegisterData): Promise<UserResponse> {
    console.log('🚀 Отправка регистрации:', data.username);
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    const userData: UserResponse = await response.json();
    this.currentUser = this.normalizeUserResponse(userData);
    return this.currentUser;
  }

  // Авторизация
  async login(identifier: string, password: string): Promise<UserResponse> {
    console.log('🔐 Попытка входа:', identifier);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password }), // бэкенд ждет email
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    const userData: UserResponse = await response.json();
    this.currentUser = this.normalizeUserResponse(userData);
    return this.currentUser;
  }

  // Нормализация (убираем лишнее, ставим дефолты)
  private normalizeUserResponse(userData: UserResponse): UserResponse {
    return {
      ...userData,
      role: userData.role || 'user',
      description: userData.description || null,
      photo: userData.photo || null,
      createdAt: userData.createdAt || new Date().toISOString(),
    };
  }

  // Получение пользователя по ID
  async getUserById(id: number | string): Promise<UserResponse | null> {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      if (!response.ok) return null;
      const userData = await response.json();
      return this.normalizeUserResponse(userData);
    } catch (error) {
      return null;
    }
  }

  // Проверка статуса подписки
  async checkSubscription(followingId: string | number): Promise<{ subscribed: boolean }> {
    const followerId = this.currentUser?.id;
    if (!followerId) return { subscribed: false };

    try {
      const response = await fetch(`${API_URL}/subscriptions/check?followerId=${followerId}&followingId=${followingId}`);
      if (!response.ok) return { subscribed: false };
      const data = await response.json();
      return { subscribed: !!(data.isSubscribed || data.subscribed) };
    } catch (error) {
      return { subscribed: false };
    }
  }

  // Переключение подписки
  async toggleSubscription(followingId: string | number): Promise<string> {
    const followerId = this.currentUser?.id;
    if (!followerId) throw new Error("Сначала войдите в аккаунт");

    const response = await fetch(
      `${API_URL}/subscriptions/toggle/${followingId}?followerId=${followerId}`, 
      { method: 'POST' }
    );
    
    if (!response.ok) await this.handleError(response);
    return await response.text(); 
  }

  // Счетчики
  async getSubscriptionCounts(userId: number | string): Promise<{ followers: number; following: number }> {
    try {
      const response = await fetch(`${API_URL}/subscriptions/count/${userId}`);
      if (!response.ok) return { followers: 0, following: 0 };
      return await response.json();
    } catch (error) {
      return { followers: 0, following: 0 };
    }
  }

  // Управление состоянием в памяти
  getCurrentUserFromMemory(): UserResponse | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }
}

export const apiService = new ApiService();