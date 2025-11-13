import { theme } from "@/constants/theme";
import { Typography } from "@/shared/ui/Typography";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

type RadioButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const RadioButton = ({ label, selected, onPress }: RadioButtonProps) => {
  const MAX_LENGTH = 19;
  const displayText = label.length > MAX_LENGTH 
    ? label.substring(0, MAX_LENGTH) + "..." 
    : label;

  return (
    <Pressable
      style={[styles.button, selected && styles.buttonActive]}
      onPress={onPress}
    >
      <Typography
        style={[styles.buttonText, selected && styles.buttonTextActive]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {displayText}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.color.background.default,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: theme.color.background.usual,
  },
  buttonText: {
    color: theme.color.text,
    fontSize: 14,
    textAlign: "center",
  },
  buttonTextActive: {
    color: theme.color.background.default,
  },
});

