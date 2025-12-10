import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Post from '../../components/Post';

export default function UrgentScreen() {
  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Post 
          imageUrl="https://picsum.photos/400/600"
          likesCount={124}
          commentsCount={15}
          repostsCount={8}
          description="Срочно! Помогите найти пропавшего кота в районе центрального парка. Рыжий, на ошейнике номер телефона."
        />
        <Post 
          imageUrl="https://picsum.photos/400/600"
          likesCount={89}
          commentsCount={7}
          repostsCount={3}
          description="Нужна срочная помощь с передержкой собаки на 2 недели. Хозяева в отпуске."
        />
        <Post 
          imageUrl="https://picsum.photos/400/600"
          likesCount={56}
          commentsCount={12}
          repostsCount={5}
          description="Найдена собака породы хаски возле торгового центра. Откликнитесь, если ваша."
        />
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECE1D1',
    paddingBottom: 52,
  },
  content: {
    flex: 1,
    paddingBottom: 52,
  },
});