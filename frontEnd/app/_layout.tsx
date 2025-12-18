// app/_layout.tsx
import { theme } from "@/constants/theme";
import { useRalewayFonts } from "@/hooks/useRalewayFonts";
import { useFonts } from 'expo-font';
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';

export default function RootLayout() {
  const { areFontsLoaded, errorFontsLoaded } = useRalewayFonts();
  const [fontsLoaded] = useFonts({
    inglobal: require('@/assets/font/inglobal.ttf')
  });
  const allFontsLoaded = areFontsLoaded && fontsLoaded;

  useEffect(() => {
    if (allFontsLoaded || errorFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [allFontsLoaded, errorFontsLoaded]);

  if (!allFontsLoaded && !errorFontsLoaded) {
    return null;
  }

  return (
    <View style={styles.rootContainer}>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <AuthGuard>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: theme.color.appBackground },
                headerShown: false,
              }}
              layout={(props) => <View style={styles.container} {...props} />}
            >
              {/* Публичные маршруты */}
              <Stack.Screen name="index" />              // Главная/логин
              <Stack.Screen name="registration" />       // Регистрация
              
              {/* Защищенные маршруты */}
              <Stack.Screen name="(tabs)" />             // Основное приложение
              <Stack.Screen name="user/[id]" />          // Профиль по id
              <Stack.Screen name="new-post" />           // Новый пост
              <Stack.Screen name="chat/[id]" />          // Чат

              
              
              {/* Модальные окна */}
              <Stack.Screen 
                name="pet-passport" 
                options={{
                  presentation: 'transparentModal',
                  animation: 'fade', 
                  headerShown: false,
                }} 
              />
              <Stack.Screen
                name="shelter-pet-card"
                options={{
                  presentation: 'transparentModal',
                  animation: 'fade',
                  headerShown: false,
                }}
              />
            </Stack>
          </AuthGuard>
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: theme.color.appBackground,
  },
  container: {
    height: "100%",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.color.appBackground,
  },
});
