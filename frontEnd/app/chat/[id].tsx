import { buildChatHeaderOptions } from "@/shared/ui/header";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage, ChatTimestamp } from "@/components/chat-message";
import { ChatMessage as ChatMessageType } from "@/types/ChatMessage";
import { theme } from "@/constants/theme";
import { useChat } from "@/hooks/useChat";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, chatName, isLoading, sendMessage } = useChat(id);
  const flatListRef = useRef<FlatList<ChatMessageType>>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: false }),
        100
      );
    }
  }, [messages.length, isLoading]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }: { item: ChatMessageType; index: number }) => {
    const thisTime = item?.timestamp ? new Date(item.timestamp).getTime() : 0;
    const prevTime =
      index > 0 && messages[index - 1]?.timestamp
        ? new Date(messages[index - 1].timestamp).getTime()
        : 0;

    const timeDiff = Math.abs(thisTime - prevTime);
    const showTimestamp = index === 0 || timeDiff > 1 * 60 * 1000; // >1 мин

    return (
      <>
        {showTimestamp && <ChatTimestamp timestamp={item?.timestamp} />}
        <ChatMessage message={item} />
      </>
    );
  };

  return (
    <>
      <Stack.Screen
        options={buildChatHeaderOptions({ name: chatName || "Чат" })}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? insets.top + 56 + 16 : 0
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) =>
              item?.messageId ? item.messageId.toString() : `temp-${index}`
            }
            contentContainerStyle={styles.messagesList}
            inverted={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            onLayout={() =>
              messages.length &&
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}
        <ChatInput onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.appBackground,
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  loadingContainer: {
    flex: 1,
  },
});