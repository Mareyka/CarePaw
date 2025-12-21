import AsyncStorage from '@react-native-async-storage/async-storage';

const QUESTIONNAIRE_HISTORY_KEY = '@questionnaire_history';
const EXPIRATION_MINUTES = 2; 

export interface QuestionnaireHistoryItem {
  id: string;
  date: string; 
  result: string;
  severity: 'low' | 'medium' | 'high';
  points: number;
  answers: number[];
}

// Сохранение результатов опроса
export const saveQuestionnaireResult = async (
  result: Omit<QuestionnaireHistoryItem, 'id'>
): Promise<void> => {
  try {
    const history = await getQuestionnaireHistory();
    const id = Date.now().toString();
    const newItem = { ...result, id };
    
    // Добавляем новый результат в начало массива
    history.unshift(newItem);
    
    // Сохраняем обновленную историю
    await AsyncStorage.setItem(QUESTIONNAIRE_HISTORY_KEY, JSON.stringify({
      data: history,
      timestamp: Date.now() 
    }));
    
    console.log('Questionnaire result saved:', newItem);
  } catch (error) {
    console.error('Error saving questionnaire result:', error);
  }
};

// Получение истории опросов
export const getQuestionnaireHistory = async (): Promise<QuestionnaireHistoryItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(QUESTIONNAIRE_HISTORY_KEY);
    
    if (!jsonValue) {
      return [];
    }
    
    const parsed = JSON.parse(jsonValue);
    
    // Проверяем, не устарели ли данные
    const currentTime = Date.now();
    const storedTime = parsed.timestamp;
    const minutesDiff = (currentTime - storedTime) / (1000 * 60);
    
    if (minutesDiff > EXPIRATION_MINUTES) {
      console.log('Questionnaire history expired, clearing...');
      await AsyncStorage.removeItem(QUESTIONNAIRE_HISTORY_KEY);
      return [];
    }
    
    return parsed.data || [];
  } catch (error) {
    console.error('Error getting questionnaire history:', error);
    return [];
  }
};

// Очистка истории
export const clearQuestionnaireHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(QUESTIONNAIRE_HISTORY_KEY);
    console.log('Questionnaire history cleared');
  } catch (error) {
    console.error('Error clearing questionnaire history:', error);
  }
};

// Проверка истечения срока
export const checkHistoryExpiration = async (): Promise<boolean> => {
  try {
    const jsonValue = await AsyncStorage.getItem(QUESTIONNAIRE_HISTORY_KEY);
    
    if (!jsonValue) {
      return true;
    }
    
    const parsed = JSON.parse(jsonValue);
    const currentTime = Date.now();
    const storedTime = parsed.timestamp;
    const minutesDiff = (currentTime - storedTime) / (1000 * 60);
    
    return minutesDiff > EXPIRATION_MINUTES;
  } catch (error) {
    console.error('Error checking history expiration:', error);
    return true;
  }
};