import { View, Text, StyleSheet, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import PetCalendarWidget from "@/components/pet-calendar/PetCalendarWidget";
import PetEventsBlock from "@/components/pet-calendar/PetEventsBlock";

export default function PetCalendar() {
  const router = useRouter();

  const markedDates = {
    "2023-08-05": { selected: true, selectedColor: "#A4B88C", selectedTextColor:"#4E5B3F" },
    "2023-08-13": { selected: true, selectedColor: "#EEB16E", selectedTextColor:"#FFF8E8" },
    "2023-08-17": { selected: true, selectedColor: "#A4B88C", selectedTextColor:"#FFF8E8" },
    "2023-09-03": { selected: true, selectedColor: "#A4B88C", selectedTextColor:"#FFF8E8" },
  };

  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.arrow}>
          <Text style={{ fontSize: 22, color: "#4E5B3F" }}>←</Text>
        </Pressable>
        <Text style={styles.headerText}>Календарь _petname_</Text>
      </View>
      <PetCalendarWidget markedDates={markedDates} />
      <PetEventsBlock />
    </View>
  );
}

const styles = StyleSheet.create({

  wrapper: {
    flex: 1,
    backgroundColor: "#FFF8E8",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#A4B88C",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  arrow: {
    marginRight: 12,
  },
  headerText: {
    color: "#FFF8E8",
    fontWeight: "400",
    fontSize: 18,
    fontFamily: "inglobal",
  }
});
