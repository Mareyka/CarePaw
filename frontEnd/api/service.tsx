import { Alert } from 'react-native';

const API_URL = 'http://localhost:8080/api';

interface RegisterData {
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
  // Добавляем эти поля:
  followersCount?: number; 
  followingCount?: number;
}

class ApiService {
  // Токен хранится только в памяти
  private authToken: string | null = null;
  // Данные пользователя в памяти
  private currentUser: UserResponse | null = null;

  // Регистрация
  async register(data: RegisterData): Promise<UserResponse> {
    try {
      console.log('🚀 Регистрация пользователя:', data.username);
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📥 Статус ответа:', response.status);
      const responseText = await response.text();
      
      if (!responseText.trim()) {
        throw new Error('Пустой ответ от сервера');
      }

      if (response.ok) {
        try {
          const userData: UserResponse = JSON.parse(responseText);
          console.log('🎉 Регистрация успешна! ID:', userData.id);
          
          // Нормализуем и сохраняем данные пользователя
          const normalizedUser = this.normalizeUserResponse(userData);
          this.currentUser = normalizedUser;
          
          return normalizedUser;
          
        } catch (e) {
          console.error('❌ Ошибка парсинга ответа:', e);
          throw new Error('Неверный формат ответа от сервера');
        }
      } else {
        let errorMessage = responseText;
        
        try {
          const parsed = JSON.parse(responseText);
          errorMessage = parsed.message || parsed;
        } catch (e) {
          console.log('📝 Ответ в текстовом формате');
        }

        // Форматируем сообщения об ошибках
        if (errorMessage.includes('Email already used')) {
          errorMessage = 'Этот email уже используется';
        } else if (errorMessage.includes('Username already used')) {
          errorMessage = 'Этот username уже используется';
        } else if (typeof errorMessage === 'string' && errorMessage.length === 1) {
          // Если сервер возвращает одиночный символ (например, "Э")
          errorMessage = 'Пользователь с такими данными уже существует';
        }

        const error = new Error(errorMessage);
        error.name = 'RegistrationError';
        throw error;
      }
    } catch (error) {
      console.error('💥 Register error:', error);
      
      // Если это уже наша ошибка - пробрасываем дальше
      if (error instanceof Error && error.name === 'RegistrationError') {
        throw error;
      }
      
      // Иначе создаем общую ошибку
      throw new Error('Не удалось подключиться к серверу');
    }
  }

  // Авторизация
  async login(identifier: string, password: string): Promise<UserResponse> {
    try {
      console.log('🔐 Авторизация пользователя:', identifier);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      console.log('📥 Статус ответа:', response.status);
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = responseText;
        
        try {
          const parsed = JSON.parse(responseText);
          errorMessage = parsed.message || parsed;
        } catch (e) {
          // Оставляем как текст
        }
        
        if (errorMessage.includes('Invalid credentials')) {
          errorMessage = 'Неверный логин или пароль';
        }
        
        throw new Error(errorMessage || 'Неверный логин или пароль');
      }

      let userData: UserResponse;
      try {
        userData = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Неверный формат ответа от сервера');
      }
      
      // Проверяем наличие обязательных полей
      if (!userData.id || !userData.username || !userData.email) {
        console.error('❌ Неполные данные пользователя:', userData);
        throw new Error('Неверный формат ответа от сервера');
      }

      // Нормализуем и сохраняем данные пользователя
      const normalizedUser = this.normalizeUserResponse(userData);
      this.currentUser = normalizedUser;
      
      console.log('✅ Авторизация успешна для:', normalizedUser.username);
      
      return normalizedUser;
      
    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    }
  }

  // Нормализация данных пользователя
  private normalizeUserResponse(userData: UserResponse): UserResponse {
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user',
      description: userData.description || null,
      photo: userData.photo || null,
      createdAt: userData.createdAt || new Date().toISOString(),
    };
  }

  // Получение списка пользователей
  async getUsers(): Promise<UserResponse[]> {
    try {
      console.log('👥 Запрос списка пользователей...');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Добавляем токен авторизации, если есть
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
        console.log('🔑 Используется токен авторизации');
      }

      const response = await fetch(`${API_URL}/users`, {
        headers,
      });

      console.log('📥 Статус:', response.status);
      
      if (response.ok) {
        const users = await response.json();
        console.log('✅ Получено пользователей:', users.length);
        return Array.isArray(users) ? users.map(user => this.normalizeUserResponse(user)) : [];
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
    // Если пользователь уже загружен, возвращаем его
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      console.log('👤 Запрос данных текущего пользователя...');
      
      let url = `${API_URL}/me`;
      if (email) {
        url += `?email=${encodeURIComponent(email)}`;
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const userData = await response.json();
        const normalizedUser = this.normalizeUserResponse(userData);
        this.currentUser = normalizedUser;
        console.log('✅ Данные пользователя получены');
        return normalizedUser;
      } else if (response.status === 401) {
        console.log('🔒 Требуется авторизация для получения данных пользователя');
        return null;
      } else {
        console.log('❌ Не удалось получить данные пользователя, статус:', response.status);
        return null;
      }
    } catch (error) {
      console.error('💥 Get current user error:', error);
      return null;
    }
  }

  // Установка/получение токена
  setToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      console.log('🔑 Токен установлен в памяти');
    } else {
      console.log('🔑 Токен удален из памяти');
    }
  }

  getToken(): string | null {
    return this.authToken;
  }

  // Получение текущего пользователя из памяти
  getCurrentUserFromMemory(): UserResponse | null {
    return this.currentUser;
  }

  // Выход (очистка данных)
  logout(): void {
    console.log('🚪 Выход из системы...');
    this.authToken = null;
    this.currentUser = null;
    console.log('✅ Данные пользователя очищены из памяти');
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Проверка соединения с сервером
  async checkConnection(): Promise<boolean> {
    try {
      console.log('🔗 Проверка соединения с сервером...');
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const isConnected = response.ok;
      console.log(isConnected ? '✅ Сервер доступен' : '❌ Сервер недоступен');
      return isConnected;
    } catch (error) {
      console.error('❌ Ошибка проверки соединения:', error);
      return false;
    }
  }

  async getUserById(id: number | string): Promise<UserResponse | null> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (response.ok) {
      const userData = await response.json();
      return this.normalizeUserResponse(userData);
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }
}


// Метод для проверки статуса (чтобы кнопка знала, что писать)
async checkSubscription(followingId: string | number): Promise<{ subscribed: boolean }> {
  // Важно: берем ID текущего авторизованного пользователя
  const followerId = this.currentUser?.id;
  if (!followerId) return { subscribed: false };

  try {
    // Отправляем запрос на эндпоинт, который мы создали в Спринге
    const response = await fetch(`${API_URL}/subscriptions/check?followerId=${followerId}&followingId=${followingId}`);
    if (response.ok) {
      const data = await response.json();
      // Убедись, что ключ в JSON совпадает с тем, что шлет Java (subscribed или isSubscribed)
      return { subscribed: data.isSubscribed || data.subscribed };
    }
    return { subscribed: false };
  } catch (error) {
    return { subscribed: false };
  }
}

// Метод для переключения подписки
async toggleSubscription(followingId: string | number): Promise<string> {
  // Нам нужно знать ID того, кто нажимает кнопку
  const followerId = this.currentUser?.id; 
  
  if (!followerId) throw new Error("Пользователь не авторизован");

  try {
    const response = await fetch(
      `${API_URL}/subscriptions/toggle/${followingId}?followerId=${followerId}`, 
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error("Ошибка сервера");
    
    return await response.text(); // Вернет "Subscribed" или "Unsubscribed"
  } catch (error) {
    throw error;
  }
}


// Получение количества подписчиков и подписок
async getSubscriptionCounts(userId: number | string): Promise<{ followers: number; following: number }> {
  try {
    const response = await fetch(`${API_URL}/subscriptions/count/${userId}`);
    
    if (response.ok) {
      return await response.json();
    }
    return { followers: 0, following: 0 };
  } catch (error) {
    console.error('💥 Get counts error:', error);
    return { followers: 0, following: 0 };
  }
}

// Проверка, подписан ли я (текущий юзер) на этого пользователя
async checkSubscriptionStatus(followerId: number, followingId: number | string): Promise<boolean> {
  try {
    // Нужно будет добавить такой эндпоинт в Спринг или проверять через список подписок
    const response = await fetch(`${API_URL}/subscriptions/check?followerId=${followerId}&followingId=${followingId}`);
    if (response.ok) {
      const data = await response.json();
      return data.isSubscribed;
    }
    return false;
  } catch (error) {
    return false;
  }
}
}

// Создаем и экспортируем синглтон экземпляр
export const apiService = new ApiService();