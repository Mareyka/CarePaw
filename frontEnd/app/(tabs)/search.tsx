import { theme } from "@/constants/theme";
import SearchInput from "@/shared/ui/search-input";
import Header from "@/components/Header";
import { Typography } from "@/shared/ui/Typography";
import { Pressable, ScrollView, StyleSheet, View, ActivityIndicator, Text, Image, TouchableOpacity } from "react-native";
import { useSearchUsers, useRandomUsers } from "@/hooks/useUsers";
import { useState } from "react";
import { useRouter } from "expo-router";
import { GlobalStyles } from "@/constants/theme";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { users: searchUsers, isLoading: isSearchLoading, error: searchError } = useSearchUsers(searchQuery);
  const { users: randomUsers, isLoading: isRandomLoading, error: randomError } = useRandomUsers();
  const router = useRouter();

  const isSearching = searchQuery.trim().length > 0;
  const users = isSearching ? searchUsers : randomUsers;
  const isLoading = isSearching ? isSearchLoading : isRandomLoading;
  const error = isSearching ? searchError : randomError;

  const handleUserPress = (userId: number) => {
    router.push({
      pathname: "/user/[id]",
      params: { id: userId.toString() }
    });
  };

  const getAvatarUrl = (photo?: string | null) => {
    if (photo && photo.trim() !== '') {
      if (photo.startsWith('http://') || photo.startsWith('https://')) {
        return photo;
      }
      // return `http://10.0.2.2:8080/api/images/avatars/${photo}`;
      return `http://localhost:8080/api/images/avatars/${photo}`;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.searchInputContainer}>
        <SearchInput 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск пользователей..."
        />
      </View>

      <Typography type="title" style={styles.sectionTitle}>
        {isSearching ? "Результаты поиска" : "Пользователи"}
      </Typography>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.color.background.darkGreen} />
          <Typography type="label" style={{ textAlign: "center", marginTop: 12 }}>
            {isSearching ? "Поиск пользователей…" : "Загружаем пользователей…"}
          </Typography>
        </View>
      )}

      {error && (
        <Typography type="label" style={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {!isLoading && !error && isSearching && users.length === 0 && (
        <Typography type="label" style={{ textAlign: "center", marginTop: 20 }}>
          Пользователи не найдены
        </Typography>
      )}

      {!isLoading && !error && users.length > 0 && (
        <ScrollView
          style={styles.scrollerWrapper}
          contentContainerStyle={styles.scroller}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {users.map((user, index) => (
            <TouchableOpacity
              key={user.id}
              style={[styles.userCard, getCardStyle(index)]}
              onPress={() => handleUserPress(user.id)}
              activeOpacity={0.7}
            >
              <View style={styles.user_img}>
                {getAvatarUrl(user.photo) ? (
                  <Image 
                    source={{ uri: getAvatarUrl(user.photo)! }}
                    style={styles.userAvatar}
                    defaultSource={require('@/assets/images/default_avatar.png')}
                  />
                ) : (
                  <View style={[
                    styles.defaultAvatar,
                    user.role === 'CLINIC' ? styles.clinicAvatar :
                    user.role === 'SHELTER' ? styles.shelterAvatar :
                    styles.userAvatarDefault
                  ]}>
                    <Text style={styles.avatarInitial}>
                      {user.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={[GlobalStyles.textSpecial, styles.username]} numberOfLines={1}>
                {user.username}
              </Text>
              
              {(user.role === 'CLINIC' || user.role === 'SHELTER') && (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>
                    {user.role === 'CLINIC' ? 'Ветклиника' : 'Приют'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.otherSection}>
        <Typography type="title" style={styles.sectionTitle}>
          Все остальное
        </Typography>

        <View style={styles.grid}>
          <Pressable style={[styles.card, styles.cardLight]}>
            <Typography type="title" style={styles.cardText}>
              Для тебя
            </Typography>
          </Pressable>
          <Pressable style={[styles.card, styles.cardGreen]}>
            <Typography type="title" style={styles.cardText}>
              Врачи
            </Typography>
          </Pressable>
          <Pressable style={[styles.card, styles.cardGreen]}>
            <Typography type="title" style={styles.cardText}>
              Питомцы
            </Typography>
          </Pressable>
          <Pressable style={[styles.card, styles.cardLight]}>
            <Typography type="title" style={styles.cardText}>
              Лакомства
            </Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
const getCardStyle = (index: number) => {
  return index % 2 === 0 
    ? GlobalStyles.bgPrimary 
    : GlobalStyles.bgQuaternary;
};

const styles = StyleSheet.create({
  searchInputContainer: {
    marginTop: 16,
    paddingHorizontal:12,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  scrollerWrapper: {
    marginTop: 16,
    paddingHorizontal:12,
    maxHeight: 180,
  },
  scroller: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 12,
  },
  userCard: {
    height: 124,
    width: 124,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  user_img: {
    height: 76,
    width: 76,
    borderRadius: 36,
    backgroundColor: '#D0C7BA',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  defaultAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicAvatar: {
    backgroundColor: '#4E5B3F',
  },
  shelterAvatar: {
    backgroundColor: '#697C44',
  },
  userAvatarDefault: {
    backgroundColor: '#D0C7BA',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 100,
  },
  roleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(78, 91, 63, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
    bedImage: {
      width: 103,
      height: 103,
    },
    childImage: {
      width: 143,
      height: 143,
    },
    gardenGridContainer: {
      marginTop: 24,
      flexDirection: "row",
      gap: 16,
      marginBottom: 64,
    },
    gardenGridColumn: {
      flexDirection: "column",
      gap: 16,
    },
    gardenImageSmall: {
      width: 100,
      height: 50,
      borderRadius: 8,
    },
    gardenImageMedium: {
      width: 100,
      height: 100,
      borderRadius: 12,
    },
    gardenImageLarge: {
      width: 100,
      height: 150,
      borderRadius: 16,
    },
    fab: {
      position: "absolute",
      alignSelf: "flex-end",
      right: 16,
      bottom: 96,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.color.background.usual,
      alignItems: "center",
      justifyContent: "center",
    },
    fabInner: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.color.background.default,
    },
    otherSection: {
      marginTop: 24,
      paddingHorizontal: 12,
      paddingBottom: 24,
    },
    sectionTitle: {
      marginLeft: 12,
      marginBottom: 12,
      color: theme.color.background.darkGreen,
      fontSize: 20,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      width: "48%",
      height: 64,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    cardLight: {
      backgroundColor: theme.color.background.default,
    },
    cardGreen: {
      backgroundColor: theme.color.background.lightGreen,
    },
    cardText: {
      color: theme.color.background.darkGreen,
    },
    container: {
      backgroundColor: theme.color.appBackground,
      height: '100%',
      paddingBottom: 52,
    },
  });
