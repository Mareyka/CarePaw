import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';

// Тип для истории опросов
interface QuestionnaireHistory {
  id: string;
  date: string;
  result: string;
  severity: 'low' | 'medium' | 'high';
}

export default function QuestionnaireHistoryScreen() {
  const router = useRouter();

  // Заглушка для истории опросов
  const questionnaireHistory: QuestionnaireHistory[] = [
    {
      id: '1',
      date: '15.12.2023',
      result: 'Всё в порядке',
      severity: 'low'
    },
    {
      id: '2',
      date: '10.12.2023',
      result: 'Лёгкое недомогание',
      severity: 'medium'
    },
    {
      id: '3',
      date: '05.12.2023',
      result: 'Требуется консультация',
      severity: 'high'
    }
  ];

  const handleStartQuestionnaire = () => {
    router.push('/(tabs)/questionnaire');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#f44336';
      default: return '#666';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Низкий риск';
      case 'medium': return 'Средний риск';
      case 'high': return 'Высокий риск';
      default: return 'Неизвестно';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={[styles.title, styles.questiontext]}>История опросов</Text>
          <Text style={styles.subtitle}>
            Здесь вы можете просмотреть историю пройденных опросов и начать новый
          </Text>

          {/* Кнопка начала нового опроса */}
          <View style={styles.startSection}>
            <Button 
              title="Начать новый опрос"
              onPress={handleStartQuestionnaire}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={[GlobalStyles.textSpecial, styles.questiontext]}>
              Рекомендуемые страницы
            </Text>
            <UserRecomend/>
          </View>

          {/* История опросов */}
          <View style={styles.historySection}>
            <Text style={styles.questiontext}>Предыдущие опросы</Text>
            
            {questionnaireHistory.length > 0 ? (
              questionnaireHistory.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(item.severity) }
                    ]}>
                      <Text style={styles.severityText}>
                        {getSeverityText(item.severity)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.historyResult}>{item.result}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  У вас пока нет пройденных опросов
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Начните первый опрос, чтобы отслеживать состояние вашего питомца
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...GlobalStyles.bgBase,
  },
  content: {
    flex: 1,
    paddingBottom: 52,
  },
  container: {
    padding: 16,
  },
  questionBlock: {
    width: '100%' ,
    height: 'auto',
    marginVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  questiontext:{
    ...GlobalStyles.textSpecial,
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 12,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    ...GlobalStyles.acsentColor,
    lineHeight: 22,
  },
  startSection: {
    padding: 8,
    alignItems: 'center',
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    ...GlobalStyles.textSpecial,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  historyResult: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    ...GlobalStyles.textSpecial,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});