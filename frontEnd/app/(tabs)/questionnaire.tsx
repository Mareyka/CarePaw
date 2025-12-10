import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import UserRecomend from '../../components/UserRecomend';
import { GlobalStyles } from '../../constants/theme';
import { useRouter } from 'expo-router';

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

  const questions: Question[] = [
    {
      id: 1,
      question: "Какое у вашего животное?",
      options: [
        { text: "Собака", points: 0 },
        { text: "Кошка", points: 0 },
        { text: "Другое", points: 1 }
      ]
    },
    {
      id: 2,
      question: "Выберите симптомы:",
      options: [
        { text: "Сухой нос", points: 1 },
        { text: "Не ходит", points: 2 },
        { text: "Тошнит", points: 2 },
        { text: "Чихает", points: 1 },
        { text: "Чешется", points: 1 }
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

  const calculateResults = (userAnswers: number[]) => {
    let totalPoints = 0;
    
    userAnswers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== undefined) {
        const points = questions[questionIndex].options[answerIndex].points;
        totalPoints += points;
      }
    });

    setShowResults(true);
  };

  const getResultMessage = () => {
    const totalPoints = answers.reduce((sum, answerIndex, questionIndex) => {
      if (answerIndex !== undefined) {
        return sum + questions[questionIndex].options[answerIndex].points;
      }
      return sum;
    }, 0);

    if (totalPoints <= 1) {
      return {
        title: "Всё в порядке",
        message: "Ваш питомец, скорее всего, здоров. Продолжайте наблюдать за его состоянием.",
        severity: "low"
      };
    } else if (totalPoints <= 3) {
      return {
        title: "Лёгкое недомогание",
        message: "Рекомендуется наблюдать за питомцем и при ухудшении состояния обратиться к врачу.",
        severity: "medium"
      };
    } else {
      return {
        title: "Требуется консультация",
        message: "Похоже, у вашего животного аллергия или другое заболевание. Рекомендуем обратиться к ветеринару.",
        severity: "high"
      };
    }
  };

  const restartQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
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
                title="Вернуться на главную"
                onPress={() => router.push('/(tabs)/')}
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
    color: '#666',
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  selectedOptionText: {
    color: '#2196F3',
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  lowSeverity: {
    borderLeftColor: '#4CAF50',
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
  },
  resultMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  clinicRecommendation: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
    width: '100%',
  },
});