// app/LoginScreen.tsx или app/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AuthForm from '../components/auth/AuthForm';
import TabHeader from '../components/ui/TabHeader';
import { apiService } from '../api/service';

export default function LoginScreen() {
 const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const router = useRouter();
  const { login } = useAuth();



 const handleLogin = async () => {
    setErrors({});
    
    if (!identifier.trim()) {
      setErrors({ username: 'Введите email или username' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Введите пароль' });
      return;
    }

    setLoading(true);
    try {
      const userData = await login(identifier, password);
      if (userData && userData.id) {
        router.replace(`/user/${userData.id}` as any);
      }
    } catch (error: any) {
      const msg = error.message || '';
      // Проверяем и на английском, и на русском (так как ApiService теперь переводит)
      if (msg.includes('Invalid credentials') || msg.includes('Неверный')) {
        setErrors({ general: 'Неверный логин или пароль' });
      } else {
        setErrors({ general: msg || 'Ошибка авторизации' });
      }
    } finally {
      setLoading(false);
    }
  };

return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.greenSection}>
        <TabHeader
          tabs={[
            { label: 'Авторизация', isActive: true, onPress: () => {} },
            { label: 'Регистрация', isActive: false, onPress: () => router.push('/registration') }
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AuthForm
          username={identifier}
          password={password}
          onUsernameChange={setIdentifier}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          loading={loading}
          errors={errors} 
        />
        
        {/* Вывод общей ошибки, если она есть */}
        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <TouchableOpacity 
          style={styles.registerContainer}
          onPress={() => router.push('/registration')}
        >
          <Text style={styles.registerText}>Нет аккаунта? Зарегистрироваться</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE1D1', 
  },
  errorText: {
  color: '#C0392B',
  marginTop: 12,
  textAlign: 'center',
},
  greenSection: {
    backgroundColor: '#A4B88C', 
    paddingTop: 60, 
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
    backgroundColor: '#ECE1D1',
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#5D684F',
    fontSize: 16,
  },
});