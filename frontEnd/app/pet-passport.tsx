import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router"; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrimaryButton from "@/components/button/PrimaryButton";

const API_URL = 'http://localhost:8080/api'; 

export default function PetPassport() {
  const router = useRouter();
  
  // 1. Получаем ID животного
  const { petId } = useLocalSearchParams();

  // 2. Состояние
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 3. Загрузка данных
  useEffect(() => {
    if (petId) {
        fetchPetDetails();
    }
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/pets/${petId}`);
        console.log("Pet details loaded:", response.data);
        setPet(response.data);
    } catch (error) {
        console.error("Error fetching pet details:", error);
    } finally {
        setLoading(false);
    }
  };

  // Индикатор загрузки
  if (loading) {
    return (
        <View style={styles.container}>
             <ActivityIndicator size="large" color="#A4B88C" />
        </View>
    );
  }

  // Если не нашли
  if (!pet) {
      return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text>Животное не найдено</Text>
                 <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{marginTop: 20, color: 'blue'}}>Назад</Text>
                 </TouchableOpacity>
            </View>
        </View>
      )
  }

  // Основной интерфейс
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.card}>
      
          <TouchableOpacity style={styles.close} onPress={() => router.back()}>
            <Text style={{fontSize: 28, color: "#697c44"}}>×</Text>
          </TouchableOpacity>

          <View style={styles.avatarCircle}>
            {pet.photoUrl ? (
              <Image source={{ uri: pet.photoUrl }} style={styles.avatarImage} />
            ) : (
              <Image source={require('../assets/images/default_avatar.png')} style={styles.avatarImage} />
            )}
          </View>

          <Text style={styles.petName}>{pet.name}</Text>
          
          <View style={styles.line} />
          
          <View style={styles.infoBlock}>
            <Text style={styles.infoText}>Вид: {pet.species || 'Не указан'}</Text>
            <Text style={styles.infoText}>Порода: {pet.breed || 'Не указана'}</Text>
            <Text style={styles.infoText}>Дата рождения: {pet.dateOfBirth || 'Не указана'}</Text>
          </View>

          <View style={styles.line} />
          
          <View style={styles.infoBlock}>
            <Text style={styles.infoText}>
                Прививки: {pet.vaccinated ? '✅ Да' : '❌ Нет'}
            </Text>
            <Text style={styles.infoText}>
                Стерилизован: {pet.sterilized ? '✅ Да' : '❌ Нет'}
            </Text>
            <Text style={styles.infoText}>
                Глистогонные: {pet.dewormed ? '✅ Да' : '❌ Нет'}
            </Text>
          </View>

          <PrimaryButton
            title="Календарь"
            onPress={() => router.push({ pathname: "/pet-calendar", params: { petId: pet.id } })} 
            style={{marginTop: 14}}
            textStyle={{fontSize: 19}}
          />


          <View style={styles.edit}>
            <Text style={{ fontSize: 22, color: "#A4B88C", transform: [{ scaleX: -1 }] }}>✎</Text>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: "#FFF8E8",
    width: '90%',        
    maxWidth: 400,       
    padding: 26,
    borderRadius: 22,
    
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    
    position: "relative",
  },

  close: {
    position: "absolute",
    right: 18,
    top: 18,
    zIndex: 2,
  },
  avatarCircle: {
    alignSelf: "center",
    backgroundColor: "#A4B88C",
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  petName: {
    alignSelf: "center",
    fontWeight: "800",
    marginVertical: 8,
    color: "#4E5B3F",
    fontSize: 20,
    fontFamily: "inglobal",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  infoBlock: {
    marginVertical: 4,
    alignItems: "flex-start",
  },
  infoText: {
    color: "#4E5B3F",
    marginVertical: 1,
    fontSize: 16,
  },
  edit: {
    alignSelf: "flex-end",
  }
});
