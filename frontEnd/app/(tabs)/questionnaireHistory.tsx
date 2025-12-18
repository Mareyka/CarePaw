import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';
import { 
  getQuestionnaireHistory, 
  clearQuestionnaireHistory,
  checkHistoryExpiration,
  QuestionnaireHistoryItem 
} from '../../services/questionnaireHistory';

export default function QuestionnaireHistoryScreen() {
  const router = useRouter();
  const [questionnaireHistory, setQuestionnaireHistory] = useState<QuestionnaireHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyExpired, setHistoryExpired] = useState(false);

  // Загружаем историю при фокусе на экране
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
      return () => {};
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      
      // Проверяем, не истекла ли история
      const isExpired = await checkHistoryExpiration();
      setHistoryExpired(isExpired);
      
      // Загружаем историю
      const history = await getQuestionnaireHistory();
      setQuestionnaireHistory(history);
      
      console.log('Loaded questionnaire history:', history);
    } catch (error) {
      console.error('Error loading questionnaire history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
  };

  const handleClearHistory = async () => {
    await clearQuestionnaireHistory();
    setQuestionnaireHistory([]);
    setHistoryExpired(true);
  };

  const handleStartQuestionnaire = () => {
    router.push('/(tabs)/questionnaire');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#697C44'; 
      case 'medium': return '#FF9800';
      case 'high': return '#f44336';
      default: return '#5D684F';
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
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4E5B3F']}
          />
        }
      >
        <View style={styles.container}>
          <Text style={[styles.title, styles.questiontext]}>История опросов</Text>

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

          {/* Кнопка очистки истории */}
          {questionnaireHistory.length > 0 && (
            <View style={styles.clearSection}>
              <Button 
                title="Очистить историю"
                onPress={handleClearHistory}
                variant="outline"
              />
            </View>
          )}

          {/* История опросов */}
          <View style={styles.historySection}>
            <Text style={styles.questiontext}>Предыдущие опросы</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Загрузка истории...</Text>
              </View>
            ) : questionnaireHistory.length > 0 ? (
              questionnaireHistory.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
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
                  <Text style={styles.historyPoints}>Баллов: {item.points}</Text>
                  <Text style={styles.historyAnswers}>
                    Ответы: {item.answers.map((a, idx) => idx + 1).join(', ')}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {historyExpired ? 'История опросов истекла' : 'У вас пока нет пройденных опросов'}
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
  expirationContainer: {
    backgroundColor: 'rgba(105, 124, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(105, 124, 68, 0.3)',
  },
  expirationText: {
    fontSize: 14,
    color: '#5D684F',
    textAlign: 'center',
    fontWeight: '500',
  },
  expiredText: {
    fontSize: 12,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  clearSection: {
    marginBottom: 16,
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
    ...GlobalStyles.bgBase,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D0C7BA',
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
    color: '#5D684F',
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
    color: '#5D684F',
    lineHeight: 20,
    marginBottom: 4,
  },
  historyPoints: {
    fontSize: 14,
    color: '#697C44',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  historyAnswers: {
    fontSize: 12,
    color: '#8a9780',
    marginTop: 2,
  },
  emptyState: {
    ...GlobalStyles.bgBase,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0C7BA',
    borderStyle: 'dashed',
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
    color: '#8a9780',
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#5D684F',
  },
});