import { theme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRalewayFonts } from "@/hooks/useRalewayFonts";
import { useFonts } from 'expo-font';
import {
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { areFontsLoaded, errorFontsLoaded } = useRalewayFonts();
  // Добавлено: загрузка inglobal.ttf
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
        <Stack
          initialRouteName="(tabs)" // Начинаем сразу с вкладок
          screenOptions={{
            contentStyle: { backgroundColor: theme.color.appBackground },
          }}
          layout={(props) => <View style={styles.container} {...props} />}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Экран создания нового поста в корне */}
          <Stack.Screen name="new-post" options={{ headerShown: false }} />
          {/* Другие экраны в корне */}
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              title: 'Авторизация'
            }} 
          />
          <Stack.Screen 
            name="registration" 
            options={{ 
              headerShown: false,
              title: 'Регистрация'
            }} 
          />
          <Stack.Screen 
            name="clinic" 
            options={{ 
              headerShown: false,
              title: 'Клиника'
            }} 
          />
          <Stack.Screen 
            name="user" 
            options={{ 
              headerShown: false,
              title: 'UserProfile'
            }} 
          />
        </Stack>
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