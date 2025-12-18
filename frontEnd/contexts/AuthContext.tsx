import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../api/auth-service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Теперь функции возвращают Promise<User>, а не void
  login: (identifier: string, password: string) => Promise<User>;
  register: (data: { 
  username: string; 
  email: string; 
  password: string; 
  description?: string 
}) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Подписываемся на изменения состояния в authService
    const unsubscribe = authService.subscribe((newState) => {
      setState(newState);
    });

    // Инициализируем auth service (проверка токена и т.д.)
    authService.initialize();

    return unsubscribe;
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    // Добавляем return, чтобы данные "пробрасывались" в RegistrationScreen
    const userData = await authService.login(identifier, password);
    return userData;
  };

  const register = async (data: { 
      username: string; 
      email: string; 
      password: string; 
      description?: string 
    }) => {
      const userData = await authService.register(data); // Передаем весь объект дальше
      return userData;
    };

  const logout = () => {
    authService.logout();
  };

  const updateUser = (userData: Partial<User>) => {
    authService.updateUserLocal(userData);
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};