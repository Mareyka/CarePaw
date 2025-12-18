import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { 
  saveQuestionnaireResult, 
  QuestionnaireHistoryItem 
} from '../../services/questionnaireHistory';

type Question = {
  id: number;
  question: string;
  options: { text: string; points: number }[];
};

export default function QuestionnaireScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "Как ваш питомец ведет себя сегодня?",
      options: [
        { text: "Активный и игривый", points: 0 },
        { text: "Обычное поведение", points: 0 },
        { text: "Немного вялый", points: 1 },
        { text: "Апатичный, лежит весь день", points: 2 }
      ]
    },
    {
      id: 2,
      question: "Какой у животного аппетит?",
      options: [
        { text: "Ест с аппетитом, как обычно", points: 0 },
        { text: "Ест немного меньше обычного", points: 1 },
        { text: "Отказывается от еды", points: 2 },
        { text: "Не притрагивается к еду весь день", points: 3 }
      ]
    },
    {
      id: 3,
      question: "Как животное пьет воду?",
      options: [
        { text: "Пьет нормально", points: 0 },
        { text: "Пьет больше обычного", points: 1 },
        { text: "Пьет меньше обычного", points: 1 },
        { text: "Отказывается от воды", points: 2 }
      ]
    },
    {
      id: 4,
      question: "Есть ли изменения в туалете?",
      options: [
        { text: "Всё как обычно", points: 0 },
        { text: "Диарея (жидкий стул)", points: 1 },
        { text: "Запор", points: 1 },
        { text: "Кровь в моче или кале", points: 3 },
        { text: "Не ходит в туалет сутки", points: 2 }
      ]
    },
    {
      id: 5,
      question: "Что заметили в поведении?",
      options: [
        { text: "Всё в порядке", points: 0 },
        { text: "Чихает или кашляет", points: 1 },
        { text: "Чешется или трясет головой", points: 1 },
        { text: "Рвота", points: 2 },
        { text: "Хромает, не наступает на лапу", points: 2 },
        { text: "Тяжело дышит или одышка", points: 2 }
      ]
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = async (userAnswers: number[]) => {
    let points = 0;
    
    userAnswers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== undefined) {
        const optionPoints = questions[questionIndex].options[answerIndex].points;
        points += optionPoints;
      }
    });

    setTotalPoints(points);
    setShowResults(true);
    
    // Сохраняем результат
    await saveQuestionnaireResult({
      date: new Date().toISOString(),
      result: getResultMessage(points).title,
      severity: getResultMessage(points).severity,
      points: points,
      answers: userAnswers
    });
  };

  const getResultMessage = (points?: number) => {
    const finalPoints = points !== undefined ? points : totalPoints;

    if (finalPoints <= 3) {
      return {
        title: "Всё в порядке",
        message: "Ваш питомец, скорее всего, здоров. Продолжайте наблюдать за его состоянием.",
        severity: "low" as const
      };
    } else if (finalPoints <= 7) {
      return {
        title: "Лёгкое недомогание",
        message: "Рекомендуется наблюдать за питомцем и при ухудшении состояния обратиться к врачу.",
        severity: "medium" as const
      };
    } else if (finalPoints <= 12) {
      return {
        title: "Требуется наблюдение",
        message: "Есть признаки недомогания. Рекомендуем обратиться к ветеринару в ближайшее время.",
        severity: "high" as const
      };
    } else {
      return {
        title: "Срочно к врачу",
        message: "Состояние питомца вызывает серьезные опасения. Немедленно обратитесь к ветеринару.",
        severity: "high" as const
      };
    }
  };

  const restartQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTotalPoints(0);
  };

  if (showResults) {
    const result = getResultMessage();
    
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>Результаты опроса</Text>
            
            <View style={[
              styles.resultCard,
              result.severity === 'high' ? styles.highSeverity : 
              result.severity === 'medium' ? styles.mediumSeverity : 
              styles.lowSeverity
            ]}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultPoints}>Набрано баллов: {totalPoints}</Text>
              <Text style={styles.resultMessage}>{result.message}</Text>
              
              {result.severity === 'high' && (
                <View style={styles.clinicRecommendation}>
                  <Text style={styles.clinicTitle}>
                    За точной и подробной консультацией рекомендуем обратиться к:
                  </Text>
                  <UserRecomend />
                </View>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              <Button 
                title="Пройти опрос заново"
                onPress={restartQuestionnaire}
                variant="secondary"
                style={styles.button}
              />
              <Button 
                title="Посмотреть историю"
                onPress={() => router.push('/(tabs)/questionnaireHistory')}
                variant="outline"
                style={styles.button}
              />
              <Button 
                title="Вернуться на главную"
                onPress={() => router.push('/(tabs)')}
                style={styles.button}
              />
            </View>
          </View>
        </ScrollView>
        <TabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Опросник состояния животного</Text>
          <Text style={styles.subtitle}>
            Ответьте на несколько вопросов, чтобы мы могли помочь определить состояние вашего питомца
          </Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Вопрос {currentQuestion + 1} из {questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {questions[currentQuestion].question}
            </Text>
            
            <View style={styles.optionsContainer}>
              {questions[currentQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    answers[currentQuestion] === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswer(index)}
                >
                  <Text style={[
                    styles.optionText,
                    answers[currentQuestion] === index && styles.selectedOptionText
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.navigation}>
            {currentQuestion > 0 && (
              <Button 
                title="Назад"
                onPress={() => setCurrentQuestion(currentQuestion - 1)}
                variant="secondary"
                style={styles.navButton}
              />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    ...GlobalStyles.textSpecial,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    ...GlobalStyles.acsentColor,
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#5D684F',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#D0C7BA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#697C44',
    borderRadius: 3,
  },
  questionCard: {
    ...GlobalStyles.bgBase,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D0C7BA',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    ...GlobalStyles.textSpecial,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(208, 199, 186, 0.3)',
    borderWidth: 1,
    borderColor: '#D0C7BA',
  },
  selectedOption: {
    backgroundColor: 'rgba(105, 124, 68, 0.2)',
    borderColor: '#697C44',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5D684F',
  },
  selectedOptionText: {
    color: '#697C44',
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButton: {
    minWidth: 120,
  },
  resultCard: {
    ...GlobalStyles.bgBase,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#D0C7BA',
    borderLeftColor: '#D0C7BA',
  },
  lowSeverity: {
    borderLeftColor: '#697C44',
  },
  mediumSeverity: {
    borderLeftColor: '#FF9800',
  },
  highSeverity: {
    borderLeftColor: '#f44336',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    ...GlobalStyles.textSpecial,
  },
  resultPoints: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#5D684F',
  },
  resultMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
    color: '#5D684F',
  },
  clinicRecommendation: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D0C7BA',
  },
  clinicTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    ...GlobalStyles.textSpecial,
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    width: '90%',
  },
});