import { theme } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 32,
    fontFamily: "Raleway_700Bold",
    color: theme.color.text,
  },
  default: {
    fontSize: 14,
    fontWeight: "regular",
    fontFamily: "Raleway_400Regular",
    color: theme.color.text,
  },
  label: {
    fontSize: 12,
    fontWeight: "regular",
    fontFamily: "Raleway_400Regular",
    color: theme.color.text,
  },
});
