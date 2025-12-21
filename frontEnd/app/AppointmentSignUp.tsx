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
import Button from '../components/Button';

interface AppointmentSignUpProps {
  visible: boolean;
  onClose: () => void;
}

export default function AppointmentSignUp({ visible, onClose }: AppointmentSignUpProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactInfo, setContactInfo] = useState('');
  const [phone, setPhone] = useState('');
  
  // Состояние: отправлена ли форма
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: '#A4B88C' }
  };

  
  const handleClose = () => {
    onClose();
  
    setTimeout(() => setIsSubmitted(false), 300);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {!isSubmitted ? (
            /* --- ПЕРВОЕ ОКНО: ФОРМА ЗАПИСИ --- */
            <ScrollView showsVerticalScrollIndicator={false}>
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

              <PetCalendarWidget 
                current={selectedDate}
                markedDates={markedDates}
                onDayPress={handleDayPress}
              />

              <Button 
                title="Записаться" 
                onPress={() => setIsSubmitted(true)} 
                style={styles.submitButton}
              />
            </ScrollView>
          ) : (
            /* --- ВТОРОЕ ОКНО: ПОДТВЕРЖДЕНИЕ --- */
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Ваша заявка для записи к врачу отправлена!
              </Text>
              <Text style={styles.successSubText}>
                С вами в ближайшее время свяжутся.
              </Text>

              <Button 
                title="Хорошо" 
                onPress={handleClose} 
                style={styles.successButton}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: "#ECE1D1", 
    width: '90%',
    padding: 24,
    borderRadius: 40,
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  submitButton: {
    backgroundColor: "#EEB16E",
    borderRadius: 30,
    marginTop: 10,
    marginHorizontal: 0, 
  },
  /* Стили для окна успеха */
  successContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 18,
    color: "#4E5B3F",
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'inglobal', 
  },
  successSubText: {
    fontSize: 18,
    color: "#4E5B3F",
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    fontFamily: 'inglobal',
  },
  successButton: {
    backgroundColor: "#EEB16E",
    borderRadius: 30,
    width: 180, 
    marginHorizontal: 0,
  }
});