import { theme } from "@/constants/theme";
import { SendIcon } from "@/assets/icons/SendIcon";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type ChatInputProps = {
  onSend: (message: string) => void;
  placeholder?: string;
} & Omit<TextInputProps, "onSubmitEditing" | "value" | "onChangeText">;

export const ChatInput = ({
  onSend,
  placeholder = "Введите сообщение",
  ...textInputProps
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={theme.color.text + "80"}
            value={message}
            onChangeText={setMessage}
            multiline
            {...textInputProps}
          />
          <Pressable
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
            hitSlop={8}
          >
            <View style={styles.iconContainer}>
              <SendIcon size={24} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  shadowContainer: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.background.default,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.color.text,
    maxHeight: 100,
    paddingRight: 8,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    opacity: 1,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});

export default ChatInput;

