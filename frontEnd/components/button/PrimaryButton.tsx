import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: any;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#EEB16E",
        borderRadius: 22,
        paddingVertical: 5,
        alignItems: "center",
        marginVertical: 8,

        shadowColor: "#A47440",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inglobal",
        fontWeight: "400",
    },
    disabled: {
        opacity: 0.4,
    },
});
