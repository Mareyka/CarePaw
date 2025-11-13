import { theme } from "@/constants/theme";
import { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

type Props = {
  icon: ReactNode;
  focused: boolean;
};

export const TabBarIcon = ({ icon, focused = false }: Props) => {
  return (
    <View style={[styles.wrapper, focused ? styles.wrapperFocused : null]}>
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 30,
    width: 48,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.background.usual || "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  wrapperFocused: {
    ...Platform.select({
      ios: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
});
