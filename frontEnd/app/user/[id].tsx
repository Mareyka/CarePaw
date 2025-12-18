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
  ScrollView,
  Alert
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, UserResponse } from '../../api/service';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import TabBar from '@/components/TabBar';
import Button from '@/components/Button';
import AppointmentSignUp from '../AppointmentSignUp';
import PostThumbnail from '@/components/PostThumbnail';

const API_URL = 'http://localhost:8080/api';
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3; // Вынесли константу, чтобы была доступна везде

// Определяем интерфейс для поста, чтобы уйти от ошибки 'never'
interface UserPost {
  id: number;
  photoUrl: string;
  title?: string;
}

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<UserResponse | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Указываем тип <UserPost[]>, чтобы убрать ошибки Property 'id' does not exist on type 'never'
  const [posts, setPosts] = useState<UserPost[]>([]);

  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });

  const isClinic = profileUser?.role === 'CLINIC';
  const isShelter = profileUser?.role === 'SHELTER';
  const isOwnProfile = currentUser?.id?.toString() === id?.toString();
  const averageRating = 4;


  // Доступные типы вкладок
  type TabType = 'POSTS' | 'LIKES' | 'SAVED';
  const [activeTab, setActiveTab] = useState<TabType>('POSTS');

  useEffect(() => {
    fetchData();
    fetchUserPosts();
  }, [id]);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts?userId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки постов:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await apiService.getUserById(id as string);
      if (userData) {
        setProfileUser(userData);
        const subCounts = await apiService.getSubscriptionCounts(id as string);
        setCounts(subCounts);

        if (currentUser && currentUser.id.toString() !== id?.toString()) {
          const subStatus = await apiService.checkSubscription(id as string);
          setIsSubscribed(subStatus.subscribed);
        }
      }
      const petsResponse = await axios.get(`${API_URL}/pets?userId=${id}`);
      setPets(petsResponse.data);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

const fetchTabData = async (tab: TabType) => {
  setLoading(true);
  setActiveTab(tab);
  
  try {
    let url = '';
    // Определяем URL на основе структуры твоего контроллера
    switch (tab) {
      case 'POSTS':
        url = `${API_URL}/posts?userId=${id}`;
        break;
      case 'LIKES':
        url = `${API_URL}/posts/user/${id}/liked-posts`;
        break;
      case 'SAVED':
        url = `${API_URL}/posts/user/${id}/saved-posts`;
        break;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Твой контроллер ожидает этот заголовок для mapToDetailedResponse
        'X-User-Id': currentUser?.id?.toString() || '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    } else {
      setPosts([]);
    }
  } catch (error) {
    console.error("Ошибка при смене вкладки:", error);
    setPosts([]);
  } finally {
    setLoading(false);
  }
};

  const handleSubscription = async () => {
    if (!currentUser) return;
    try {
      const result = await apiService.toggleSubscription(id as string);
      setIsSubscribed(result.trim() === "Subscribed");
      const freshCounts = await apiService.getSubscriptionCounts(id as string);
      setCounts(freshCounts);
    } catch (error: any) {
      console.error("Ошибка подписки:", error.message);
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

      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()} // Теперь 'id' существует
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              {/* 1. ВЕРХНЯЯ ПАНЕЛЬ */}
              <View style={styles.menuContainer}>
                {!isOwnProfile ? (
                  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#4E5B3F" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => router.push('/settings')}>
                    <Ionicons name="menu" size={24} color="#4E5B3F" />
                  </TouchableOpacity>
                )}
              </View>

              {/* 2. АВАТАР И СТАТИСТИКА */}
              <View style={styles.row2}>
                <View style={styles.avatarColumn}>
                  <Image 
                    source={profileUser.photo?.trim() ? { uri: profileUser.photo } : require('@/assets/images/default_avatar.png')} 
                    style={styles.avatarImage}
                  />
                  {(isClinic || isShelter) && (
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Ionicons key={num} name="star" size={14} color={averageRating >= num ? '#EEB16E' : '#CCCCCC'} />
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.infoColumn}>
                  <Text style={styles.userName}>{profileUser.username}</Text>
                  <Text style={styles.roleText}>{isClinic ? "Ветклиника" : isShelter ? "Приют" : "Пользователь"}</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{posts.length}</Text>
                      <Text style={styles.statLabel}>публикаций</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{counts.followers}</Text>
                      <Text style={styles.statLabel}>подписчиков</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* 3. КНОПКИ ДЕЙСТВИЯ И ОПИСАНИЕ */}
              <View style={styles.row3}>
                <View style={styles.actionButtonsContainer}>
                  {!isOwnProfile ? (
                    isClinic ? (
                      <Button title="Записаться" onPress={() => setIsAppointmentModalVisible(true)} />
                    ) : (
                      <Button 
                        title={isSubscribed ? "Вы подписаны" : "Подписаться"} 
                        onPress={handleSubscription} 
                        variant={isSubscribed ? "outline" : "primary"} 
                      />
                    )
                  ) : (
                    <Button title="Настройки" onPress={() => router.push('/settings')} variant="outline" />
                  )}
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{profileUser.description || "Информация отсутствует"}</Text>
                </View>
              </View>

              {/* 4. КОНТАКТЫ */}
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
                    <TouchableOpacity key={pet.id} style={styles.storyItem} onPress={() => router.push({ pathname: '/pet-passport', params: { petId: pet.id } })}>
                      <View style={styles.petCircle}>
                        <Image source={pet.photoUrl ? { uri: pet.photoUrl } : require('@/assets/images/default_avatar.png')} style={styles.petImage} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.divider} />
              <View style={styles.row5}>
                <TouchableOpacity onPress={() => fetchTabData('POSTS')}>
                  <Image 
                    source={require('@/assets/images/posts.svg')} 
                    style={{ opacity: activeTab === 'POSTS' ? 1 : 0.3 }} 
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => fetchTabData('LIKES')}>
                  <Image 
                    source={require('@/assets/images/like.svg')} 
                    style={{ opacity: activeTab === 'LIKES' ? 1 : 0.3 }} 
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => fetchTabData('SAVED')}>
                  <Image 
                    source={require('@/assets/images/Tag.svg')} 
                    style={{ opacity: activeTab === 'SAVED' ? 1 : 0.3 }} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
          </View>
        }
        renderItem={({ item }) => (
          <PostThumbnail 
            photoUrl={item.photoUrl} 
            onPress={() => console.log('Клик по посту', item.id)} // Просто лог
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет публикаций</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <AppointmentSignUp 
          visible={isAppointmentModalVisible} 
          onClose={() => setIsAppointmentModalVisible(false)} 
      />
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
  listContent: {
    backgroundColor: '#ECE1D1',
    flexGrow: 1,
  },
  headerSpacer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E5B3F',
    marginBottom: 10,
  },
  thumbnailContainer: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH, // Делаем квадратным
    padding: 1, // Тонкая граница между фото
  },
  thumbnailImage: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#4E5B3F',
    opacity: 0.5,
  },
});