import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RegistrationForm from '../components/auth/RegistrationForm';
import TabHeader from '../components/ui/TabHeader';
import { apiService } from '../api/service';

export default function RegistrationScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Добавляем поле email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState(''); // Опциональное поле
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const router = useRouter();

 const handleRegistration = async () => {
    setErrors({});
    
    // Валидация на клиенте (оставлена как была, она верная)
    const newErrors: any = {};
    if (!username.trim()) newErrors.username = 'Введите имя пользователя';
    if (!email.trim()) newErrors.email = 'Введите email';
    if (!password) newErrors.password = 'Введите пароль';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const userData = await register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        description: description.trim()
      });

      if (userData?.id) {
        router.replace(`/user/${userData.id}`);
      }
    } catch (error: any) {
      const msg = error.message || '';
      
      if (error.fields) {
        setErrors(error.fields);
      } else if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes('имя') || msg.toLowerCase().includes('username')) {
        setErrors({ username: msg });
      } else {
        setErrors({ general: msg });
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
            { label: 'Авторизация', isActive: false, onPress: () => router.push('/') },
            { label: 'Регистрация', isActive: true, onPress: () => {} }
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <RegistrationForm
          username={username}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          description={description}
          onUsernameChange={setUsername}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onDescriptionChange={setDescription}
          onSubmit={handleRegistration}
          loading={loading}
          errors={errors}
        />

        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <TouchableOpacity style={styles.loginContainer} onPress={() => router.push('/')}>
          <Text style={styles.loginText}>Уже есть аккаунт? Войти</Text>
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
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#5D684F',
    fontSize: 16,
  },
  errorText: {
    color: '#C0392B',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
});