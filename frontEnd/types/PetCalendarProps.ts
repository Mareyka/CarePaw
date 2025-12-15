import { CalendarProps } from "react-native-calendars";

export type PetCalendarWidgetProps = {
    markedDates: CalendarProps["markedDates"];
    onDayPress?: (day: {dateString: string}) => void;
  };