import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../api/auth-service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загружаем сохраненные данные при монтировании
    const loadAuthData = async () => {
      setIsLoading(true);
      
      // Подписываемся на изменения
      const unsubscribe = authService.subscribe((state) => {
        setUser(state.user);
        setIsAuthenticated(state.isAuthenticated);
        setIsLoading(false);
      });
      
      return unsubscribe;
    };

    loadAuthData();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login(identifier, password);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    await authService.updateUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
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