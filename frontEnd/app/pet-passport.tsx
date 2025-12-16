import { View, Text, StyleSheet, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import PrimaryButton from "@/components/button/PrimaryButton";

export default function PetPassport() {
  const router = useRouter();

  // Здесь можно получить данные животного из стора или пропсов, пока мок:
  const pet = {
    image: '', 
    name: '_petname_',
    type: 'Тип животного',
    breed: 'Порода',
    age: 'Возраст',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    operated: false,
  };

  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.close}>
        <Text style={{fontSize: 28, color: "#697c44"}}>×</Text>
      </View>
      <View style={styles.avatarCircle}>
        {pet.image ? (
          <Image source={{ uri: pet.image }} style={styles.avatarImage} />
        ) : (
          <Text style={{fontSize: 32, color: "#5D684F"}}>👤</Text>
        )}
      </View>
      <Text style={styles.petName}>{pet.name}</Text>
      <View style={styles.line} />
      <View style={styles.infoBlock}>
        <Text style={styles.infoText}>{pet.type}</Text>
        <Text style={styles.infoText}>{pet.breed}</Text>
        <Text style={styles.infoText}>{pet.age}</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.infoBlock}>
        <Text style={styles.infoText}>Прививки</Text>
        <Text style={styles.infoText}>Кастрировано</Text>
        <Text style={styles.infoText}>Глистогонные</Text>
        <Text style={styles.infoText}>Операции</Text>
      </View>
      <PrimaryButton
        title="Календарь"
        onPress={() => router.push("/pet-calendar")}
        style={{marginTop: 14}}
        textStyle={{fontSize: 19}}
      />

      <View style={styles.edit}>
        <Text style={{ fontSize: 22, color: "#A4B88C", transform: [{ scaleX: -1 }] }}>✎</Text>
      </View>
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
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  petName: {
    alignSelf: "center",
    fontWeight: "800",
    marginVertical: 8,
    color: "#4E5B3F",
    fontFamily: "inglobal",
    fontSize: 18,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  infoBlock: {
    marginVertical: 4,
    alignItems: "flex-start",
  },
  infoText: {
    color: "#4E5B3F",
    marginVertical: 1,
  },
  edit: {
    alignSelf: "flex-end",
  }
});
