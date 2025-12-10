import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import Post from '../../components/Post';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  const handleQuestionnairePress = () => {
    router.push('/(tabs)/questionnaire');
  };

  return (
    <View style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Post 
          imageUrl="https://picsum.photos/400/600"
          likesCount={124}
          commentsCount={15}
          repostsCount={8}
        />

        <View style={styles.questionBlock}>
          <Text style={[GlobalStyles.textSpecial, styles.questiontext]}>
            Рекомендуемые страницы
          </Text>
          <UserRecomend/>
        </View>

        <View style={styles.questionBlock}>
          <Text style={[GlobalStyles.textSpecial, styles.questiontext]}>
            С вашим питомцем что-то случилось?
          </Text>
          <Button 
            title="Пройти опрос"
            onPress={handleQuestionnairePress}
            style={styles.questionButton}
          />
        </View>
        
        <Post 
          imageUrl="https://picsum.photos/400/600"
          likesCount={89}
          commentsCount={7}
          repostsCount={3}
        />
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...GlobalStyles.bgBase,
    paddingBottom: 52,
  },
  content: {
    flex: 1,
    paddingBottom: 52,
  },
  questionBlock: {
    width: '100%' ,
    height: 'auto',
    paddingHorizontal: 10,
    marginVertical: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  questiontext:{
    ...GlobalStyles.textSpecial,
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 12,
  },
  questionButton: {
    minWidth: 120,
  },
});