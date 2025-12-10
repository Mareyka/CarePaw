import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import TabBar_button from './TabBar_button';
import Home_icon from '../assets/TabBar_icons/Home_icon';
import Search_icon from '../assets/TabBar_icons/Search_icon';
import AddPost_icon from '../assets/TabBar_icons/AddPost_icon';
import Chat_icon from '../assets/TabBar_icons/Chat_icon';
import Profile_icon from '../assets/TabBar_icons/Profile_icon';
import { GlobalStyles } from '../constants/theme';

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [    
    { 
      id: 'chat', 
      icon: <Chat_icon />,
      route: '/forums?mode=chats' // forums с параметром mode=chats
    },
    { 
      id: 'search', 
      icon: <Search_icon />,
      route: '/(tabs)/search' // Поиск в (tabs)
    },
    { 
      id: 'add', 
      icon: <AddPost_icon />,
      route: '/new-post' // КОРНЕВОЙ экран new-post
    },
    { 
      id: 'home', 
      icon: <Home_icon />,
      route: '/(tabs)/' // Главная
    },
    { 
      id: 'profile', 
      icon: <Profile_icon />,
      route: '/profile' // Профиль в корне
    },
  ];

  // Определяем активный таб
  const getActiveTab = () => {
    if (pathname.includes('/forums')) return 'chat';
    if (pathname.includes('/(tabs)/search')) return 'search';
    if (pathname === '/new-post' || pathname.includes('/new-post')) return 'add';
    if (pathname === '/profile' || pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/questionnaire')) return null;
    if (pathname.includes('/questionnaireHistory')) return null;
    if (pathname.includes('/chat/[')) return 'chat';
    if (pathname === '/' || pathname === '/(tabs)/') return 'home';
    return null;
  };

  const activeTab = getActiveTab();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <View key={tab.id} style={styles.tabItem}>
          <TabBar_button 
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onPress={() => handleTabPress(tab.route)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    ...GlobalStyles.bgPrimary,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabItem: {
    alignItems: 'center',
  },
});

export default TabBar;