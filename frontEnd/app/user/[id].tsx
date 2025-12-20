import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
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
   Modal, 
  TextInput,
  Alert
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, UserResponse } from '../../api/service';
import { Ionicons } from '@expo/vector-icons';
import TabBar from '@/components/TabBar';
import Button from '@/components/Button';
import AppointmentSignUp from '../AppointmentSignUp';
import { getPetsByUserId, resolvePetPhotoUrl } from '@/api/pets';
import PostThumbnail from '@/components/PostThumbnail';

const API_URL = 'http://localhost:8080/api';
// const API_URL = 'http://10.0.2.2:8080/api';
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3; 

// Определяем интерфейс для поста
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
  
  const [posts, setPosts] = useState<UserPost[]>([]);

  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });

  const isClinic = profileUser?.role === 'CLINIC';
  const isShelter = profileUser?.role === 'SHELTER';
  const isOwnProfile = currentUser?.id?.toString() === id?.toString();
  const averageRating = 4;

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  });

  if (!result.canceled) {
    setEditForm({ ...editForm, photo: result.assets[0].uri });
  }
};

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    description: '',
    photo: ''
  });

  useEffect(() => {
  if (profileUser) {
    setEditForm({
      username: profileUser.username || '',
      description: profileUser.description || '',
      photo: profileUser.photo || ''
    });
  }
}, [profileUser]);

const handleUpdateProfile = async () => {
  try {
    setLoading(true);
    const updatedUser = await apiService.updateUser(id as string, editForm);
    
    // Если запрос прошел успешно:
    setProfileUser(updatedUser);
    setIsEditModalVisible(false); // Закрываем только при успехе
    Alert.alert("Успех", "Профиль обновлен");
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    Alert.alert("Ошибка", "Сервер не принял данные (415). Проверь консоль бэкенда.");
  } finally {
    setLoading(false);
  }
};

  const fetchPets = async () => {
    try {
      if (!id) return;
      const list = await getPetsByUserId(id as string);
      setPets(list);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  // Доступные типы вкладок
  type TabType = 'POSTS' | 'LIKES' | 'SAVED';
  const [activeTab, setActiveTab] = useState<TabType>('POSTS');

  useEffect(() => {
    fetchData();
    fetchUserPosts();
  }, [id]);


  useFocusEffect(
    React.useCallback(() => {
      if (!id) return;
      fetchPets();
    }, [id])
  );


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
        
        await fetchPets();

        if (currentUser && currentUser.id.toString() !== id?.toString()) {
          const subStatus = await apiService.checkSubscription(id as string);
          setIsSubscribed(subStatus.subscribed);
        }
      }
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
    // Определяем URL на основе структуры контроллера
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
        keyExtractor={(item) => item.id.toString()} 
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
                      source={
                        profileUser.photo 
                          ? { uri: `http://10.0.2.2:8080/api/images/avatars/${profileUser.photo}?t=${Date.now()}` }
                          // ? { uri: `http://localhost:8080/api/images/avatars/${profileUser.photo}?t=${Date.now()}` } 
                          : require('@/assets/images/default_avatar.png')
                      } 
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
                  <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}> 
                    {isClinic ? (
                      // Если это КЛИНИКА — только кнопка записи
                      <Button 
                        title="Записаться" 
                        onPress={() => setIsAppointmentModalVisible(true)} 
                        style={{ flex: 1 }} 
                      />
                    ) : profileUser.role === 'SHELTER' ? (
                      // Если это ПРИЮТ — только кнопка подписки (без "Написать")
                      <Button 
                        title={isSubscribed ? "Вы подписаны" : "Подписаться"} 
                        onPress={handleSubscription} 
                        variant={isSubscribed ? "outline" : "primary"} 
                        style={{ flex: 1 }} 
                      />
                    ) : (
                      // Если это ОБЫЧНЫЙ ЮЗЕР — и подписка, и "Написать"
                      <>
                        <Button 
                          title={isSubscribed ? "Вы подписаны" : "Подписаться"} 
                          onPress={handleSubscription} 
                          variant={isSubscribed ? "outline" : "primary"} 
                          style={{ flex: 1 }} 
                        />
                        <Button 
                          title="Написать" 
                          onPress={() => {/* навигация в чат */}} 
                          variant="outline"
                          style={{ flex: 1 }} 
                        />
                      </>
                    )}
                  </View>
                ) : (
                  <Button 
                    title="Изменить" 
                    onPress={() => setIsEditModalVisible(true)} 
                    variant="outline" 
                  />
                )}
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {profileUser.description || "Информация отсутствует"}
                </Text>
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
          <TouchableOpacity
            key={pet.id}
            style={styles.storyItem}
            onPress={() =>
              router.push({
                pathname: '/pet-passport',
                params: { petId: pet.id, ownerId: id, shelterOwner: isShelter ? 'true' : 'false' },
              })
            }
          >
            <View style={styles.petCircle}>
              <Image
                source={
                  resolvePetPhotoUrl(pet.photoUrl)
                    ? { uri: resolvePetPhotoUrl(pet.photoUrl) as string }
                    : require('@/assets/images/default_avatar.png')
                }
                style={styles.petImage}
              />
            </View>
          </TouchableOpacity>
        ))}

        {isOwnProfile && (
          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => router.push({ pathname: '/pet-passport', params: { mode: 'create' } })}
          >
            <View style={[styles.petCircle, styles.addPetCircle]}>
              <Text style={styles.addPetPlus}>+</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )}

  <View style={styles.divider} />

  {/* --- ТАБЫ --- */}
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
            onPress={() => console.log('Клик по посту', item.id)} 
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
      <Modal
  visible={isEditModalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Редактировать профиль</Text>
      
      <Text style={styles.inputLabel}>Имя пользователя</Text>
      <TextInput
        style={styles.input}
        value={editForm.username}
        onChangeText={(text) => setEditForm({...editForm, username: text})}
      />

      <Text style={styles.inputLabel}>О себе</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={editForm.description}
        onChangeText={(text) => setEditForm({...editForm, description: text})}
      />

      <Text style={styles.inputLabel}>URL фото</Text>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text>Выбрать фото из галереи</Text>
      </TouchableOpacity>
      {editForm.photo && <Image source={{ uri: editForm.photo }} style={styles.previewImage} />}

      <View style={styles.modalButtons}>
        <TouchableOpacity 
          style={[styles.modalButton, { backgroundColor: '#ccc' }]} 
          onPress={() => setIsEditModalVisible(false)}
        >
          <Text>Отмена</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modalButton, { backgroundColor: '#697c44' }]} 
          onPress={handleUpdateProfile}
        >
          <Text style={{ color: '#fff' }}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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
    alignItems: 'flex-start', 
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
    paddingBottom: 80,
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
    height: COLUMN_WIDTH, 
    padding: 1, 
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ECE1D1',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E5B3F',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#4E5B3F',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D0C7BA',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 0.45,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  imagePickerButton: {
    backgroundColor: '#D0C7BA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#4E5B3F',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    color: '#4E5B3F',
    fontSize: 14,
    fontWeight: '600',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#697c44',
  },
});
