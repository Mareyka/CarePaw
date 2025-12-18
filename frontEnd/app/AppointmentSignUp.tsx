import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView 
} from 'react-native';
import PetCalendarWidget from '../components/pet-calendar/PetCalendarWidget';
import PrimaryButton from '../components/button/PrimaryButton';

interface AppointmentSignUpProps {
  visible: boolean;
  onClose: () => void;
}

export default function AppointmentSignUp({ visible, onClose }: AppointmentSignUpProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactInfo, setContactInfo] = useState('');
  const [phone, setPhone] = useState('');

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const markedDates = {
    [selectedDate]: { 
        selected: true, 
        selectedColor: '#A4B88C', // Цвет выделения кружка в календаре
        selectedTextColor: '#FFF' 
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Кнопка закрытия Х */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 10}}>
            {/* Поля ввода */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Имя пользователя, эл. адрес"
                placeholderTextColor="#A4B88C"
                value={contactInfo}
                onChangeText={setContactInfo}
              />
              <TextInput
                style={styles.input}
                placeholder="+375 ( _ _ ) _ _ _  _ _  _ _"
                placeholderTextColor="#A4B88C"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Виджет календаря */}
            <PetCalendarWidget 
              current={selectedDate}
              markedDates={markedDates}
              onDayPress={handleDayPress}
            />

            {/* Кнопка Записаться */}
            <PrimaryButton 
              title="Записаться" 
              onPress={() => {
                console.log("Данные записи:", { contactInfo, phone, selectedDate });
                onClose();
              }}
              style={styles.submitButton}
              textStyle={styles.buttonText}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Затемнение посветлее, чтобы не было слишком мрачно
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: "#ECE1D1", 
    width: '90%',
    maxHeight: '85%',
    padding: 20,
    borderRadius: 40, // На макете углы очень круглые
    position: 'relative',
    borderWidth: 1,
    borderColor: '#A4B88C',
  },
  closeButton: {
    position: 'absolute',
    right: 25,
    top: 15,
    zIndex: 10,
  },
  closeText: {
    fontSize: 38,
    color: "#4E5B3F",
    fontWeight: '200',
  },
  inputContainer: {
    marginTop: 40,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFF8E8",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 25,
    fontSize: 16,
    color: "#4E5B3F",
    marginBottom: 18,
    // Тень как на фото (мягкая подложка)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: "#EEB16E", // Тот самый оранжево-песочный цвет с макета
    borderRadius: 30,
    marginTop: 5,
    height: 55,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
  }
});