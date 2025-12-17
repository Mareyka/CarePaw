import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

export default function PetCalendarWidget({ markedDates, onDayPress, current }: any) {
  return (
    <View style={styles.calendarBlock}>
      <Calendar
        current={current || new Date().toISOString().split('T')[0]} 
        onDayPress={onDayPress}
        monthFormat={"MMMM yyyy"}
        markedDates={markedDates}
        theme={{
          backgroundColor: "#FFF8E8",
          calendarBackground: "#FFF8E8",
          textSectionTitleColor: "#A4B88C",
          dayTextColor: "#4E5B3F",
          todayTextColor: "#EEB16E",
          selectedDayTextColor: "#FFF8E8",
          selectedDayBackgroundColor: "#A4B88C",
          arrowColor: "#4E5B3F", 
        }}
        style={{
          borderRadius: 22,
          borderColor: "#A4B88C",
          borderWidth: 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarBlock: {
    marginBottom: 16,
  }
});
