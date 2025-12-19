import { Alert } from 'react-native';

export const API_URL = 'http://localhost:8080/api';
export const API_URL_WITHOUT_API = 'http://localhost:8080';

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

  private async handleError(response: Response) {
    const responseText = await response.text();
    let message = 'Произошла ошибка';

    try {
      const parsed = JSON.parse(responseText);
      message = parsed.message || parsed;
    } catch (e) {
      message = responseText;
    }

    if (message.includes('Email already used')) message = 'Этот email уже зарегистрирован';
    if (message.includes('Username already used')) message = 'Это имя пользователя уже занято';
    if (message.includes('Invalid credentials')) message = 'Неверный логин или пароль';
    if (message === 'Unauthorized') message = 'Ошибка авторизации';

    const error = new Error(message);
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
      body: JSON.stringify({ email: identifier, password }),
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    const userData: UserResponse = await response.json();
    this.currentUser = this.normalizeUserResponse(userData);
    return this.currentUser;
  }

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

async updateUser(userId: string, data: { username: string, description: string, photo?: string }) {
  const formData = new FormData();
  
  formData.append("username", data.username);
  formData.append("description", data.description);

  // ПРОВЕРКА: Если фото есть и это локальный файл (выбранный в галерее)
if (data.photo && !data.photo.startsWith('http')) {
    const localUri = data.photo; 

    
    if (localUri.startsWith('blob:') || localUri.startsWith('data:')) {
        const response = await fetch(localUri);
        const blob = await response.blob();
        formData.append("photoFile", blob, `avatar_${userId}.jpg`);
    } else {
       
        formData.append("photoFile", {
            uri: localUri, 
            name: `avatar_${userId}.jpg`,
            type: 'image/jpeg',
        } as any);
    }
    console.log("📤 Файл добавлен в FormData");

  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
     const errorText = await response.text();
     throw new Error(errorText || "Ошибка при обновлении");
  }
  return await response.json();
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

async createPost({
  title,
  placeId,
  isUrgently,
  userId,
  imageUri
}: {
  title: string;
  placeId: string | number;
  isUrgently: boolean;
  userId: number;
  imageUri?: string | null;
}): Promise<any> {
  try {
    console.log("Отправка нового поста...");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("placeId", String(placeId));
    formData.append("isUrgently", String(isUrgently));
    formData.append("userId", String(userId));

    if (imageUri) {
      const fileName = imageUri.split("/").pop()!;
      const fileType = fileName.split(".").pop();
      formData.append("photo", {
        uri: imageUri,
        type: `image/${fileType}`,
        name: fileName,
      } as any);
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      },
      body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Ошибка загрузки поста");
    }

    const data = JSON.parse(responseText);
    console.log("Пост успешно создан:", data);
    return data;
  } catch (error) {
    console.error("Ошибка создания поста:", error);
    throw new Error("Не удалось создать пост. Проверь соединение или данные.");
  }
}
}

export const apiService = new ApiService();