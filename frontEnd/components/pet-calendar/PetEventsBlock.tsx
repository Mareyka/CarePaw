import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PetEventsBlockProps {
  events: any[];
  selectedDate: string;
  onAddEvent?: () => void;
}

export default function PetEventsBlock({ events, selectedDate, onAddEvent }: PetEventsBlockProps) {
  const formatDateRU = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const formatTimeRU = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const eventsForSelectedDate = events.filter((e: any) => (e.eventDate || '').startsWith(selectedDate));

  const upcomingEvents = events
    .filter((e: any) => (e.eventDate || '').split('T')[0] > selectedDate)
    .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  return (
    <View style={styles.events}>
      <Text style={styles.today}>{isToday ? 'Сегодня' : 'Выбрано'} ({formatDateRU(selectedDate)})</Text>

      {onAddEvent && (
        <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
          <Text style={styles.addButtonText}>Добавить событие</Text>
        </TouchableOpacity>
      )}

      {eventsForSelectedDate.length > 0 ? (
        eventsForSelectedDate.map((evt: any) => (
          <Text key={evt.id} style={styles.eventText}>
            {evt.title} — {formatTimeRU(evt.eventDate)}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>Нет событий на этот день</Text>
      )}

      {upcomingEvents.length > 0 && (
        <>
          <Text style={styles.upcoming}>Предстоящие</Text>
          {upcomingEvents.map((evt: any) => (
            <View key={evt.id} style={{ marginBottom: 8 }}>
              <Text style={styles.dateLabel}>{formatDateRU(evt.eventDate)}</Text>
              <Text style={styles.eventText}>
                {evt.title} — {formatTimeRU(evt.eventDate)}
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  events: {
    marginBottom: 20,
  },
  today: {
    color: '#EEB16E',
    fontSize: 20,
    marginVertical: 8,
    fontWeight: 'bold',
    fontFamily: 'inglobal',
  },
  upcoming: {
    color: '#A4B88C',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'inglobal',
  },
  eventText: {
    color: '#4E5B3F',
    fontSize: 16,
    marginBottom: 4,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 14,
  },
  dateLabel: {
    color: '#888',
    fontSize: 12,
  },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#A4B88C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFF8E8',
    fontWeight: '500',
    fontFamily: 'inglobal',
  },
});

