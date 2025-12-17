import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import PetCalendarWidget from "@/components/pet-calendar/PetCalendarWidget";
import PetEventsBlock from "@/components/pet-calendar/PetEventsBlock";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export default function PetCalendar() {
  const router = useRouter();
  const { petId } = useLocalSearchParams();
  const activePetId = petId ? Number(petId) : 1; 

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Текущая дата в формате YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    if (activePetId) {
        console.log("Fetching events for petId:", activePetId);
        fetchEvents();
    }
  }, [activePetId]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/pet/${activePetId}`);
      console.log("Events loaded:", response.data);
      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkedDates = () => {
    const marks: any = {};
    
    events.forEach((evt: any) => {
      const dateKey = (evt.eventDate || "").split('T')[0];
      
      if (!dateKey) return;

      let dotColor = '#A4B88C';
      if (evt.eventType === 'medical') dotColor = '#FF6B6B';
      if (evt.eventType === 'shop') dotColor = '#FFD93D';

      marks[dateKey] = { 
        marked: true, 
        dotColor: dotColor,
        selected: dateKey === selectedDate,
        selectedColor: '#A4B88C',
        selectedTextColor: "#FFF8E8"
      };
    });

    if (!marks[selectedDate]) {
        marks[selectedDate] = { 
            selected: true, 
            selectedColor: '#A4B88C', 
            selectedTextColor: "#FFF8E8" 
        };
    } else {
        marks[selectedDate].selected = true;
        marks[selectedDate].selectedColor = '#A4B88C';
        marks[selectedDate].selectedTextColor = "#FFF8E8";
    }

    return marks;
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  if (loading) {
     return <ActivityIndicator style={{marginTop: 50}} size="large" color="#A4B88C" />
  }

  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.arrow}>
          <Text style={{ fontSize: 22, color: "#4E5B3F" }}>←</Text>
        </Pressable>
        <Text style={styles.headerText}>Календарь</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
          <PetCalendarWidget 
              markedDates={getMarkedDates()} 
              onDayPress={onDayPress}
              current={selectedDate}
          />
          <PetEventsBlock 
              events={events} 
              selectedDate={selectedDate} 
          />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFF8E8",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#A4B88C",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  arrow: {
    marginRight: 12,
  },
  headerText: {
    color: "#FFF8E8",
    fontWeight: "400",
    fontSize: 20,
    fontFamily: "inglobal",
  }
});
