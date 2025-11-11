import { Text, type TextProps } from "react-native";
import { styles } from "./styles";

export type ThemedTextProps = TextProps & {
  type?: "title" | "default" | "label";
};

export const Typography = ({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) => {
  return <Text style={[styles[type], style]} {...rest} />;
};
