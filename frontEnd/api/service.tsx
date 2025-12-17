// api/service.ts
import { Alert } from 'react-native';

const API_URL = 'http://localhost:8080/api';

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

interface UserResponse {
  id: number;
  username: string;
  email: string;
}

interface LoginRequest {
  identifier: string; // Может быть email или username
  password: string;
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
    const responseText = await response.text(); // Получаем текст
    console.log('📥 Тело ответа (сырое):', responseText);
    
    // Проверяем, пустой ли ответ
    if (!responseText.trim()) {
      console.log('⚠️ Пустой ответ от сервера');
      throw new Error('Пустой ответ от сервера');
    }

    let errorMessage = responseText;
    
    // Пробуем распарсить как JSON (на случай если сервер вернет JSON)
    try {
      const parsed = JSON.parse(responseText);
      if (parsed.message || typeof parsed === 'string') {
        errorMessage = parsed.message || parsed;
      }
    } catch (e) {
      // Не JSON, оставляем как текст
      console.log('📝 Ответ в текстовом формате');
    }

    if (response.ok) {
      // Успешный ответ должен быть JSON
      try {
        const userData = JSON.parse(responseText);
        console.log('🎉 Регистрация успешна!', userData);
        return userData;
      } catch (e) {
        console.error('❌ Не удалось распарсить успешный ответ:', e);
        throw new Error('Неверный формат ответа от сервера');
      }
    } else {
      console.log('❌ Ошибка регистрации:', errorMessage);
      
      // Форматируем сообщение об ошибке
      let formattedError = errorMessage;
      
      if (errorMessage.includes('Email already used')) {
        formattedError = 'Этот email уже используется';
      } else if (errorMessage.includes('Username already used')) {
        formattedError = 'Этот username уже используется';
      } else if (errorMessage === 'Э') {
        // Если сервер почему-то возвращает "Э"
        formattedError = 'Пользователь с такими данными уже существует';
      }
      
      // Создаем структурированную ошибку
      const error = new Error(formattedError);
      error.name = 'RegistrationError';
      
      // Добавляем дополнительные поля для определения типа ошибки
      if (errorMessage.includes('Email already used')) {
        (error as any).field = 'email';
      } else if (errorMessage.includes('Username already used')) {
        (error as any).field = 'username';
      }
      
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

  // Авторизация по username ИЛИ email
async login(identifier: string, password: string): Promise<UserResponse> {
  try {
    console.log('🔐 Отправка запроса на авторизацию:', { identifier });
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        identifier, // отправляем как identifier
        password 
      }),
    });

    console.log('📥 Статус ответа:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка авторизации:', errorText);
      throw new Error(errorText || 'Неверный логин или пароль');
    }

    const userData = await response.json();
    console.log('✅ Пользователь авторизован:', userData);
    return userData;
    
  } catch (error) {
    console.error('💥 Login error:', error);
    throw error;
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