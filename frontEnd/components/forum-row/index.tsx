import { Typography } from "@/shared/ui/Typography";
import { theme } from "@/constants/theme";
import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";
import { Image, ImageSource } from "expo-image";

type ForumRowProps = {
  title: string;
  lastMessage?: string;
  avatarUri?: string | ImageSource;
  onPress?: (event: GestureResponderEvent) => void;
};

const defaultAvatar = require("@/assets/images/avatar-default.png");

export const ForumRow = ({ 
  title, 
  lastMessage = "Последнее сообщение",
  avatarUri,
  onPress 
}: ForumRowProps) => {
  const content = (
    <>
      <Image
        source={avatarUri || defaultAvatar}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
        <Typography type="title" style={styles.rowTitle}>
          {title}
        </Typography>
        <Typography type="label">{lastMessage}</Typography>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.forumRow}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.forumRow}>{content}</View>;
};

const styles = StyleSheet.create({
  forumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomColor: "rgba(0,0,0,0.08)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rowTitle: {
    fontSize: 16,
    color: theme.color.background.darkGreen,
  },
});

export default ForumRow;

