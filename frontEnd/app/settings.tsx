import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";

export default function SettingsScreen() {
  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.close}>
          <Text style={{ fontSize: 36, color: "#697c44", fontFamily: "inglobal" }}>×</Text>
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Центр аккаунтов</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Пароль, безопасность, личные данные</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Настройка приложения</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Circle cx="12" cy="12" r="3" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Внешний вид</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="7" r="4" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Специальные возможности</Text>
            </View>
          </View>

          <View style={styles.card}>
             <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M2 12h20" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Язык</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Уведомления</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="3" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Расширенные</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Поддержка</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M12 17h.01" stroke="#415635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <Text style={styles.cardText}>Поддержка</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ECE1D1',
  },
  container: {
    padding: 24,
    paddingTop: 16,
    minHeight: '100%',
  },
  content: {
    marginTop: 20,
  },
  close: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#697c44",
    marginBottom: 12,
    marginTop: 20,
    fontFamily: "inglobal",
  },
  card: {
    backgroundColor: "#f6f3e7",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 13,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  cardText: {
    fontSize: 12,
    color: "#415635",
    fontWeight: "500",
    fontFamily: "inglobal",
    flex: 1
  },
});
