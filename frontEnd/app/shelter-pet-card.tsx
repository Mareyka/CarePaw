import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import TakePetPopup from "@/components/take-pet-pop-up/TakePetPopup";
import PrimaryButton from "@/components/button/PrimaryButton";


export default function PetPassport() {
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.close}>
        <Text style={{fontSize: 28, color: "#697c44"}}>×</Text>
      </View>
      <View style={styles.avatarCircle}>
        <Text style={{fontSize: 32, color: "#5D684F"}}>👤</Text>
      </View>
      <Text style={styles.petName}>_petname_</Text>
      <View style={styles.line} />
      <View style={styles.infoBlock}>
        <Text style={styles.infoText}>Тип животного</Text>
        <Text style={styles.infoText}>Порода</Text>
        <Text style={styles.infoText}>Возраст</Text>
      </View>
      <View style={styles.line} />
      
      <View style={styles.row}>
        {/* Просто пустой цветной квадрат без карты */}
        <View style={styles.mapPreview} />
        
        <View style={{marginLeft: 16}}>
          <Text style={styles.mapText}>Адрес</Text>
          <Text style={styles.mapText}>Почта</Text>
          <Text style={styles.mapText}>Телефон</Text>
        </View>
      </View>

      <PrimaryButton
        title="Забрать"
        onPress={() => setPopupVisible(true)}
        style={{ marginTop: 14 }}
        textStyle={{
          fontSize: 20,
          fontWeight: "400",
          fontFamily: "inglobal"
        }}
      />
      <TakePetPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFF8E8",
    margin: 32,
    padding: 26,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 3,
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
    borderRadius: 48,
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  petName: {
    alignSelf: "center",
    fontWeight: "800",
    marginVertical: 8,
    color: "#4E5B3F",
    fontFamily: "inglobal",
    fontSize: 16,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  infoBlock: {
    alignItems: "flex-start",
    marginVertical: 4,
  },
  infoText:{
    color: "#4E5B3F",
  },
  row: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: 'center',
  },
  mapPreview: {
    width: 72, 
    height: 72,
    borderRadius: 12,
    backgroundColor: "#ece1d1", // Цвет заглушки
  },
  mapText:{
    color: "#4E5B3F",
  }
});
