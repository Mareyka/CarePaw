import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios'; 
import Button from '../components/Button';
import PostCard from '../components/ui/PostCard';
import TabBar from '@/components/TabBar';

// Настройка API
const API_URL = 'http://localhost:8080/api'; 
const USER_ID = 1;

interface ClinicProps{
    onSubmit: () => void;
    loading?: boolean;
}

export default function UserProfile({onSubmit, loading = false}:ClinicProps){

    const router = useRouter();
    const [averageRating, setAverageRating] = useState(4.3);
    
    // 1. Добавили состояние для списка животных
    const [pets, setPets] = useState<any[]>([]);

    // 2. Загружаем животных при открытии страницы
    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await axios.get(`${API_URL}/pets?userId=${USER_ID}`);
            console.log("Pets loaded:", response.data);
            setPets(response.data);
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    // sample posts — в реальном приложении получите с сервера
    const posts = Array.from({ length: 12 }).map((_, i) => ({
      id: i.toString(),
      uri: `https://picsum.photos/seed/clinic-${i}/600`, // случайные картинки
    }));

    const numColumns = 3;
    const screenWidth = Dimensions.get("window").width;
    const itemGap = 4;
    const itemSize = Math.floor(screenWidth / 3);

    return (
        <>
       <Stack.Screen 
        options={{
          headerShown: false, // ← Скрываем заголовок
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Верхняя часть с информацией о клинике */}
        <View style={styles.headerContainer}>
          {/* Стрелка назад */}
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Image
                 source={require('../assets/images/menu.svg')}
                 style={styles.menu} />
            </TouchableOpacity>
          </View>

          {/* Аватар и информация */}
          <View style={styles.row2}>
            {/* Аватар (левая колонка) */}
            <View style={styles.avatarContainer}>
              {/* Иконка аватара */}
              <View style={styles.iconContainer}>
                <Image
                 source={require('../assets/images/default_avatar.png')}
                 style={styles.iconPlaceholder} />
              </View>
            </View>

            {/* Информация пользователя (правая колонка) */}
            <View style={styles.usernameContainer}>
              {/* Имя пользователя */}
              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>_username._</Text>
              </View>

              {/* Публикации и подписчики */}
              <View style={styles.statsContainer}>
                <View style={styles.publicationContainer}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>публикаций</Text>
                </View>
                <View style={styles.subscribersContainer}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>подписчиков</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Кнопки и описание */}
          <View style={styles.row3}>
            {/* Описание (правая колонка) */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                Веду фрэндли блог про свою собачку, Димми. 
                Делюсь его нарядами и результатами наших тренировок
              </Text>
            </View>
          </View>
        </View>

          {/* --- СЕКЦИЯ ДОМАШНИХ ЖИВОТНЫХ --- */}
          <View style={styles.storyFeed}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
            {/* Динамический список питомцев */}
            {pets.map((pet) => (
               <TouchableOpacity 
                  key={pet.id} 
                  style={styles.story}
                  onPress={() => router.push({ pathname: '/pet-passport', params: { petId: pet.id } })}
               >
                  <View style={styles.petCircle}>
                      <Image 
                          source={pet.photoUrl ? { uri: pet.photoUrl } : require('../assets/images/default_avatar.png')}
                          style={styles.storyImage}
                      />
                  </View>
               </TouchableOpacity>
            ))}

            {/* Кнопка добавления (+) */}
            <TouchableOpacity style={styles.story}>
              <View style={[styles.petCircle, styles.addBtnCircle]}>
                <Text style={{
                    fontSize: 34, 
                    color: '#697c44', 
                    lineHeight: 34,
                    marginTop: -4,  
                    textAlign: 'center' 
                }}>+</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </View>


        {/* Разделительная линия */}
        <View style={styles.divider} />
        <View style={styles.row5}>
          <Image
          source={require('../assets/images/posts.svg')}/>
          <Image
          source={require('../assets/images/like.svg')}/>
          <Image
          source={require('../assets/images/Tag.svg')}/>
        </View>
         {/* Разделительная линия */}
        <View style={styles.divider} />
        {/* Сетка постов */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContainer}
          renderItem={({ item }) => (
            <PostCard
              image={item.uri}
              size={itemSize}
              onPress={() => {
                console.log("Open post", item.id);
              }}
            />
          )}
          style={styles.flatList}
        />
        <TabBar />
      </SafeAreaView>
       </>
    );
}
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#ECE1D1',
  },
  
  headerContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#ECE1D1',
  },
  
  menuContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems:"flex-end",
    paddingVertical: 8,
  },
  menu:{
    width:20, 
    height:20,
  },

  row2: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconContainer: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconPlaceholder: {
    width: 90,
    height: 90,
  },

  // --- СТИЛИ ДЛЯ ДОМ ЖИВ ---
  storyFeed:{
    flexDirection: "row",
    paddingHorizontal: 16, 
    marginBottom: 10,
    marginTop: 10,
  },

  story:{
    marginRight: 12,
    alignItems: 'center',
  }, 

  petCircle: {
    width: 50,          
    height: 50,
    borderRadius: 32,   
    borderWidth: 2,     
    borderColor: '#697c44', 
    padding: 2,         
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },

  storyImage:{
    width: '100%',     
    height: '100%',
    borderRadius: 30,   
    resizeMode: 'cover', 
  },

  addBtnCircle: {
    borderColor: '#697c44',
    borderStyle: 'solid', 
    backgroundColor: 'transparent',
  },
  // -------------------------------------

  starsContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  
  usernameContainer: {
    flex: 2,
    marginLeft: 20,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  
  userNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#4E5B3F',
  },
  
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  role: {
    fontSize: 16,
    color:'#4E5B3F',
  },
  
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  publicationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  subscribersContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#4E5B3F',
  },
  
  statLabel: {
    fontSize: 12,
    color:'#4E5B3F',
    marginTop: 2,
  },
  
  row3: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  
  buttonsContainer: {
    flex: 1.2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  
  actionButton: {
    backgroundColor: '#A4B88C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  actionButtonText: {
    color:'#4E5B3F',
    fontWeight: '600',
    fontSize: 14,
  },
  
  descriptionContainer: {
    flex: 2,
    marginLeft: 20,
    justifyContent: 'center',
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color:'#4E5B3F',
  },
  
  row4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingBottom: 20,
  },
    row5: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  
    paddingHorizontal:40,
  },
  
  contactButton: {
    flex: 1,
    backgroundColor: '#ECE1D1',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0C7BA',
    shadowColor: '#5D684F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4.69,
    elevation: 4,
  },
  
  contactButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  
  divider: {
    height: 1,
    backgroundColor: "#5D684F",
    marginHorizontal: 16,
    marginVertical:10,
  },
  
  flatList: {
    flex: 1,
    backgroundColor: '#ECE1D1',
  },
  
  postsContainer: {
    padding: 0,
    paddingBottom: 40,
  },
  
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
});

