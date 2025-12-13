import { View, Text, StyleSheet } from "react-native";

export default function PetEventsBlock() {
  return (
    <View style={styles.events}>
      <Text style={styles.today}>Сегодня (13.08.2023)</Text>
      <Text style={styles.eventText}>Доставка из зоомагазина “КотикиСобачки” в 12:00</Text>
      <Text style={styles.upcoming}>Предстоящие (17.08.2023)</Text>
      <Text style={styles.eventText}>Запись в ветклинику “Усатые и полосатые” на 13:45</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  events: {
    marginBottom: 20,
  },
  today: {
    color: "#EEB16E",
    fontSize: 18,
    marginVertical: 8,
  },
  upcoming: {
    color: "#A4B88C",
    fontSize: 18,
    marginVertical: 8,
  },
  eventText: {
    color: "#4E5B3F",
    fontSize: 16,
    marginBottom: 4,
  },
});
