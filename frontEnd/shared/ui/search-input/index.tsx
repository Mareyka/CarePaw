import { SearchIcon } from "@/assets/icons/SearchIcon";
import { theme } from "@/constants/theme";
import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

type SearchInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  onPressIcon?: () => void;
};

export const SearchInput = ({
  containerStyle,
  placeholder = "Поиск...",
  onPressIcon,
  ...props
}: SearchInputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.color.text + "99"}
        style={styles.input}
        {...props}
      />
      <Pressable style={styles.iconButton} hitSlop={8} onPress={onPressIcon}>
        <SearchIcon />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.background.default,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 8,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.color.text,
    paddingVertical: 8,
  },
  iconButton: {
    marginLeft: 8,
  },
});

export default SearchInput;


