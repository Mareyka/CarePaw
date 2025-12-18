// app/clinic.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import Button from '../components/Button';
import PostCard from '../components/ui/PostCard';



export default function Clinic(){

    const router = useRouter();
    const [averageRating, setAverageRating] = useState(4.3);

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
      <SafeAreaView style={styles.safeArea}>
        {/* Верхняя часть с информацией о клинике */}
        <View style={styles.headerContainer}>
          {/* Стрелка назад */}
          <View style={styles.arrowContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
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
              
              {/* Звезды/рейтинг */}
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <Image
                    key={num}
                    source={require('../assets/images/star.png')}
                    style={{
                      width: 15,
                      height: 15,
                      marginHorizontal: 1,
                      tintColor: averageRating >= num ? '#EEB16E' : '#CCCCCC',
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Информация пользователя (правая колонка) */}
            <View style={styles.usernameContainer}>
              {/* Имя пользователя */}
              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>_username._</Text>
              </View>

              {/* Роль/специализация */}
              <View style={styles.roleContainer}>
                <Text style={styles.role}>Ветклиника</Text>
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
            {/* Кнопки (левая колонка) */}
            <View style={styles.buttonsContainer}>
              
                <Button
                  title="Записаться"
                  onPress={() => console.log('Нажата кнопка: Записаться')}
                  loading={false}
                />
              
            </View>

            {/* Описание (правая колонка) */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                Наша клиника с самым лучшим оборудованием и передовыми технологиями.
                Гордимся нашим персоналом :)
              </Text>
            </View>
          </View>

          {/* Кнопки контактов */}
          <View style={styles.row4}>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Сообщение</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Электронн...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Телефон</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Разделительная линия */}
        <View style={styles.divider} />
        <View style={styles.row5}>
          <Image
          source={require('../assets/images/posts.svg')}/>
          <Image
          source={require('../assets/images/documents.svg')}/>
          <Image
          source={require('../assets/images/comm.svg')}/>
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
    backgroundColor: '#ECE1D1',
  },
  
  arrowContainer: {
    height: 40,
    justifyContent: 'center',
    paddingVertical: 8,
  },

  row2: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  starIcon: {
  width: 15,
  height: 15,
  marginHorizontal: 1,
},

addBtnText: {
  fontSize: 34,
  color: '#697c44',
  textAlign: 'center',
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