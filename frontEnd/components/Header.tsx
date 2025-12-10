import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import LogoIcon from '../assets/LogoIcon';
import Ask_icon from '../assets/Ask_icon';
import { GlobalStyles } from '../constants/theme';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Определяем активную вкладку на основе текущего пути
  const getActiveTab = () => {
    if (pathname.includes('/map')) return 'Карта';
    if (pathname.includes('/urgent')) return 'Срочное';
    if (pathname.includes('/questionnaire')) return null;
    if (pathname.includes('/questionnaireHistory')) return null;
    if (pathname.includes('/search')) return null;
    if (pathname.includes('/forums')) return null;
    if (pathname.includes('/new-post')) return null;
    if (pathname.includes('/profile')) return null;
    return 'Главная';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { name: 'Карта', route: '/(tabs)/map' },
    { name: 'Главная', route: '/(tabs)/' },
    { name: 'Срочное', route: '/(tabs)/urgent' }
  ];

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const handleLogoPress = () => {
    router.push('/(tabs)/' as any);
  };

  const handleAskPress = () => {
    router.push('/(tabs)/questionnaireHistory' as any);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleLogoPress}>
        <LogoIcon/>
      </TouchableOpacity>
      
      <View style={styles.navContainer}>
        <View style={styles.nav}>
          {navItems.map((item) => (
            <TouchableOpacity 
              key={item.name}
              style={[
                styles.navButton,
                activeTab === item.name && styles.activeNavButton
              ]}
              onPress={() => handleTabPress(item.route)}
            >
              <Text style={[
                styles.navText,
                activeTab === item.name && styles.activeNavText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={handleAskPress}>
        <Ask_icon/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...GlobalStyles.bgPrimary,
  },
  navContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  nav: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  activeNavButton: {
    ...GlobalStyles.bgBase,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  navText: {
    ...GlobalStyles.mergeBgcolor,
    ...GlobalStyles.textSpecial,
  },
  activeNavText: {
    ...GlobalStyles.acsentColor,
    ...GlobalStyles.textSpecial,
  },
});

export default Header;