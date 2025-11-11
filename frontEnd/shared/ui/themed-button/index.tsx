import { theme } from "@/constants/theme";
import { ReactNode } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Typography } from "../Typography";

type Props = {
  icon?: ReactNode;
  children?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  textAlign?: "flex-start" | "center";
};

export const ThemedButton = ({
  icon,
  children,
  onPress,
  disabled = false,
  textAlign = "flex-start",
}: Props) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={[
          styles.wrapper,
          disabled ? styles.wrapperDisabled : null,
          { justifyContent: textAlign },
        ]}
      >
        {icon}
        {children && <Typography style={styles.text}>{children}</Typography>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.color.background.usual,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    borderRadius: 20,
  },
  wrapperDisabled: {
    backgroundColor: theme.color.background.disabled,
  },
  text: {
    color: theme.color.background.default,
  },
});
