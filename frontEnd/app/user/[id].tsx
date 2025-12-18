import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
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
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, UserResponse } from '../../api/service';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import TabBar from '@/components/TabBar';
import PostCard from '@/components/ui/PostCard';
import Button from '@/components/Button';

const API_URL = 'http://localhost:8080/api';
const { width } = Dimensions.get('window');

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<UserResponse | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  const [isSubscribed, setIsSubscribed] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });


  // Константы для сетки постов
  const numColumns = 3;
  const itemSize = width / numColumns;

  const isClinic = profileUser?.role === 'CLINIC';
  const isShelter = profileUser?.role === 'SHELTER';
  const isOwnProfile = currentUser?.id?.toString() === id?.toString();
  const averageRating = 4;

  useEffect(() => {
    fetchData();
  }, [id]);

const fetchData = async () => {
  setLoading(true);
  try {
    const userData = await apiService.getUserById(id as string);
    if (userData) {
      setProfileUser(userData);

      // Загружаем актуальные счетчики с сервера
      const subCounts = await apiService.getSubscriptionCounts(id as string);
      setCounts(subCounts);

      // ПРОВЕРКА СТАТУСА
      if (currentUser && currentUser.id.toString() !== id?.toString()) {
        const subStatus = await apiService.checkSubscription(id as string);
        console.log("Статус подписки из БД:", subStatus.subscribed); // Добавь лог для проверки
        setIsSubscribed(subStatus.subscribed);
      }
    }

    // 4. Загружаем питомцев
    const petsResponse = await axios.get(`${API_URL}/pets?userId=${id}`);
    setPets(petsResponse.data);
    
  } catch (error) {
    console.error("Error loading profile data:", error);
  } finally {
    setLoading(false);
  }
};


const handleSubscription = async () => {
  if (!currentUser) return;

  try {
    const result = await apiService.toggleSubscription(id as string);
    console.log("Результат:", result);

    if (result.trim() === "Subscribed") {
      setIsSubscribed(true);
      setCounts(prev => ({
        ...prev,
        followers: Number(prev.followers) + 1
      }));
    } else {
      setIsSubscribed(false);
      setCounts(prev => ({
        ...prev,
        followers: Math.max(0, Number(prev.followers) - 1)
      }));
    }
    
    // НЕ ВЫЗЫВАЙ здесь fetchData(), иначе он затрет локальный плюс-один старыми данными с сервера!
  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#697c44" />
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View style={styles.safeArea}>
        <Text>Пользователь не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          
          {/* 1. ВЕРХНЯЯ ПАНЕЛЬ */}
          <View style={styles.menuContainer}>
            {!isOwnProfile ? (
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#4E5B3F" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.push('/settings')}>
                <Image 
                  source={require('@/assets/images/menu.svg')} 
                  style={styles.menuIcon} 
                />
              </TouchableOpacity>
            )}
          </View>

          {/* 2. АВАТАР И СТАТИСТИКА */}
          <View style={styles.row2}>
            <View style={styles.avatarColumn}>
              <Image 
                source={
                  profileUser.photo && profileUser.photo.trim() !== "" 
                    ? { uri: profileUser.photo } 
                    : require('@/assets/images/default_avatar.png')
                } 
                defaultSource={require('@/assets/images/default_avatar.png')}
                style={styles.avatarImage}
              />
              {(isClinic || isShelter) && (
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Image
                      key={num}
                      source={require('@/assets/images/star.png')}
                      style={[styles.starIcon, { tintColor: averageRating >= num ? '#EEB16E' : '#CCCCCC' }]}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.userName}>{profileUser.username}</Text>
              <Text style={styles.roleText}>
                {isClinic ? "Ветклиника" : isShelter ? "Приют" : "Пользователь"}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>публикаций</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{Number(counts.followers)}</Text>
                  <Text style={styles.statLabel}>подписчиков</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. КНОПКИ ДЕЙСТВИЯ И ОПИСАНИЕ */}
          <View style={styles.row3}>
            <View style={styles.actionButtonsContainer}>
                {/* Если это НЕ мой профиль, показываем кнопку действия */}
                {!isOwnProfile ? (
                    isClinic ? (
                    <Button title="Записаться" onPress={() => console.log('Запись')} />
                    ) : (
                    <Button 
                        // Если isSubscribed === true, меняем текст
                        title={isSubscribed ? "Вы подписаны" : "Подписаться"} 
                        onPress={handleSubscription} 
                        // Можно менять стиль (variant), если ты его настроил в компоненте Button
                        variant={isSubscribed ? "outline" : "primary"} 
                    />
                    )
                ) : (
                    /* Если это МОЙ профиль, здесь будет пусто, чтобы описание справа не съезжало */
                    <View style={{ flex: 0.8 }} />
                )}
                </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {profileUser.description || "Информация отсутствует"}
              </Text>
            </View>
          </View>

          {/* 4. КОНТАКТЫ (ДЛЯ ОРГАНИЗАЦИЙ) */}
          {(isClinic || isShelter) && (
            <View style={styles.row4}>
              {['Сообщение', 'Email', 'Телефон'].map((label) => (
                <TouchableOpacity key={label} style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* --- СЕКЦИЯ ЖИВОТНЫХ --- */}
        {!isClinic && (
          <View style={styles.storyFeed}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => (
                <TouchableOpacity 
                  key={pet.id} 
                  style={styles.storyItem}
                  onPress={() => router.push({ pathname: '/pet-passport', params: { petId: pet.id } })}
                >
                  <View style={styles.petCircle}>
                    <Image 
                      source={pet.photoUrl ? { uri: pet.photoUrl } : require('@/assets/images/default_avatar.png')}
                      style={styles.petImage}
                    />
                  </View>
                </TouchableOpacity>
              ))}
              {isOwnProfile && (
                <TouchableOpacity style={styles.storyItem} onPress={() => console.log('Add pet')}>
                  <View style={[styles.petCircle, styles.addPetCircle]}>
                    <Text style={styles.addPetPlus}>+</Text>
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* 5. ВКЛАДКИ И СЕТКА */}
        <View style={styles.divider} />
        <View style={styles.row5}>
          <Image source={require('@/assets/images/posts.svg')} />
          {isClinic || isShelter ? (
            <>
              <Image source={require('@/assets/images/documents.svg')} />
              <Image source={require('@/assets/images/comm.svg')} />
            </>
          ) : (
            <>
              <Image source={require('@/assets/images/like.svg')} />
              <Image source={require('@/assets/images/Tag.svg')} />
            </>
          )}
        </View>
        <View style={styles.divider} />

        {/* Тут будет ваша FlatList или сетка постов */}
        <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#4E5B3F', opacity: 0.5 }}>Нет публикаций</Text>
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECE1D1',
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  menuContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarColumn: {
    alignItems: 'center',
    width: 100,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D0C7BA',
  },
  infoColumn: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E5B3F',
  },
  roleText: {
    fontSize: 16,
    color: '#4E5B3F',
    marginVertical: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E5B3F',
  },
  statLabel: {
    fontSize: 11,
    color: '#4E5B3F',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  starIcon: {
    width: 14,
    height: 14,
    marginHorizontal: 1,
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Чтобы кнопка не тянулась по высоте текста
    marginVertical: 15,
  },
  actionButtonsContainer: {
    flex: 1,
    marginRight: 15,
  },
  descriptionContainer: {
    flex: 1.5,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4E5B3F',
  },
  row4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#ECE1D1',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0C7BA',
    elevation: 3,
    shadowColor: '#5D684F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  contactButtonText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },
  storyFeed: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  storyItem: {
    marginRight: 15,
  },
  petCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#697c44',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  addPetCircle: {
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  addPetPlus: {
    fontSize: 30,
    color: '#697c44',
  },
  divider: {
    height: 1,
    backgroundColor: "#5D684F",
    marginHorizontal: 16,
    marginVertical: 10,
    opacity: 0.3,
  },
  row5: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginVertical: 5,
  },
});