import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import PetCalendarWidget from '@/components/pet-calendar/PetCalendarWidget';
import PetEventsBlock from '@/components/pet-calendar/PetEventsBlock';
import { createPetEvent, getEventsByPetId, type PetEventType } from '@/api/pet-events';

export default function PetCalendar() {
  const router = useRouter();
  const { petId } = useLocalSearchParams();
  const activePetId = petId ? Number(petId) : 1;

  const goBackSafe = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newType, setNewType] = useState<PetEventType>('medical');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activePetId) return;
    fetchEvents();
  }, [activePetId]);

  const fetchEvents = async () => {
    try {
      const list = await getEventsByPetId(activePetId);
      setEvents(list);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkedDates = () => {
    const marks: any = {};

    events.forEach((evt: any) => {
      const dateKey = (evt.eventDate || '').split('T')[0];
      if (!dateKey) return;

      let dotColor = '#A4B88C';
      if (evt.eventType === 'medical') dotColor = '#FF6B6B';
      if (evt.eventType === 'shop') dotColor = '#FFD93D';

      marks[dateKey] = {
        marked: true,
        dotColor,
        selected: dateKey === selectedDate,
        selectedColor: '#A4B88C',
        selectedTextColor: '#FFF8E8',
      };
    });

    if (!marks[selectedDate]) {
      marks[selectedDate] = { selected: true, selectedColor: '#A4B88C', selectedTextColor: '#FFF8E8' };
    } else {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = '#A4B88C';
      marks[selectedDate].selectedTextColor = '#FFF8E8';
    }

    return marks;
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const openAddModal = () => {
    setNewTitle('');
    setNewDescription('');
    setNewTime('12:00');
    setNewType('medical');
    setIsAddModalVisible(true);
  };

  const isValidTime = (value: string) => /^\d{2}:\d{2}$/.test(value);

  const saveEvent = async () => {
    if (isSaving) return;
    if (!newTitle.trim()) {
      Alert.alert('Проверьте данные', 'Название события обязательно.');
      return;
    }
    if (!isValidTime(newTime.trim())) {
      Alert.alert('Проверьте данные', 'Время должно быть в формате HH:MM, например 13:45.');
      return;
    }

    setIsSaving(true);
    try {
      const isoDateTime = `${selectedDate}T${newTime.trim()}:00`;
      await createPetEvent(activePetId, {
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        eventType: newType,
        eventDate: isoDateTime,
      });
      setIsAddModalVisible(false);
      await fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Ошибка', 'Не удалось добавить событие. Проверьте сервер и повторите.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#A4B88C" />;
  }

  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={goBackSafe} style={styles.arrow}>
          <Text style={{ fontSize: 22, color: '#4E5B3F' }}>←</Text>
        </Pressable>
        <Text style={styles.headerText}>Календарь</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <PetCalendarWidget markedDates={getMarkedDates()} onDayPress={onDayPress} current={selectedDate} />
        <PetEventsBlock events={events} selectedDate={selectedDate} onAddEvent={openAddModal} />
      </ScrollView>

      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Новое событие</Text>
            <Text style={styles.modalSubtitle}>Дата: {selectedDate}</Text>

            <Text style={styles.label}>Название *</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Например: Прививка"
              placeholderTextColor="#9AA08F"
              style={styles.input}
            />

            <Text style={styles.label}>Описание</Text>
            <TextInput
              value={newDescription}
              onChangeText={setNewDescription}
              placeholder="Комментарий"
              placeholderTextColor="#9AA08F"
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <Text style={styles.label}>Время (HH:MM)</Text>
            <TextInput
              value={newTime}
              onChangeText={setNewTime}
              placeholder="13:45"
              placeholderTextColor="#9AA08F"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Тип</Text>
            <View style={styles.typeRow}>
              {(
                [
                  ['medical', 'Мед'],
                  ['shop', 'Покупка'],
                  ['beauty', 'Уход'],
                  ['other', 'Другое'],
                ] as Array<[PetEventType, string]>
              ).map(([type, label]) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, newType === type && styles.typeChipActive]}
                  onPress={() => setNewType(type)}
                >
                  <Text style={[styles.typeChipText, newType === type && styles.typeChipTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setIsAddModalVisible(false)}>
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={saveEvent}>
                <Text style={styles.saveText}>{isSaving ? 'Сохранение…' : 'Сохранить'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF8E8',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#A4B88C',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  arrow: {
    marginRight: 12,
  },
  headerText: {
    color: '#FFF8E8',
    fontWeight: '400',
    fontSize: 20,
    fontFamily: 'inglobal',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFF8E8',
    borderRadius: 18,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'inglobal',
    color: '#4E5B3F',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#7A806F',
    marginBottom: 12,
  },
  label: {
    color: '#4E5B3F',
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0C7BA',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#4E5B3F',
    backgroundColor: '#fff',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: '#D0C7BA',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  typeChipActive: {
    backgroundColor: '#A4B88C',
    borderColor: '#A4B88C',
  },
  typeChipText: {
    color: '#4E5B3F',
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: '#FFF8E8',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  cancelBtn: {
    backgroundColor: '#ECE1D1',
  },
  saveBtn: {
    backgroundColor: '#EEB16E',
  },
  cancelText: {
    color: '#4E5B3F',
    fontWeight: '500',
    fontFamily: 'inglobal',
  },
  saveText: {
    color: '#FFF8E8',
    fontWeight: '500',
    fontFamily: 'inglobal',
  },
});
