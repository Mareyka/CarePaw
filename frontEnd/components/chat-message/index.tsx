import { Typography } from "@/shared/ui/Typography";
import { theme } from "@/constants/theme";
import { ChatMessage as ChatMessageType } from "@/types/ChatMessage";
import React from "react";
import { StyleSheet, View } from "react-native";

type ChatMessageProps = {
  message: ChatMessageType;
};


const formatTime = (timestamp?: Date | string): string => {
  if (!timestamp) return "";
  const date =
    typeof timestamp === "string" && timestamp
      ? new Date(timestamp)
      : (timestamp as Date);
  if (isNaN(date.getTime())) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.bubble,
          message.isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Typography
          type="default"
          style={[
            styles.messageText,
            message.isOwn ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {message.text ?? message.content ?? ""}
        </Typography>
      </View>
    </View>
  );
};

export const ChatTimestamp = ({ timestamp }: { timestamp?: Date | string }) => {
  return (
    <View style={styles.timestampContainer}>
      <Typography type="label" style={styles.timestamp}>
        {formatTime(timestamp)}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  ownMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: theme.color.background.usual,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: theme.color.background.default,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: theme.color.background.default,
  },
  otherMessageText: {
    color: theme.color.text,
  },
  timestampContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  timestamp: {
    color: theme.color.text,
    fontSize: 12,
    opacity: 0.6,
  },
});

export default ChatMessage;