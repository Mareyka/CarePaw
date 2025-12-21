import { theme } from "@/constants/theme";
import { buildForumChatHeaderOptions } from "@/shared/ui/header";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ForumRow } from "@/components/forum-row";
import { useForums } from "@/hooks/useForums";

export default function ForumsOrChatsScreen() {
  const router = useRouter();
  const { chats, isLoading, refreshChats } = useForums();

  useFocusEffect(
    React.useCallback(() => {
      refreshChats();
    }, [refreshChats])
  );

  const handleChatPress = (recipientId: string) => {
    router.push({
      pathname: "/chat/[id]",
      params: { id: recipientId },
    } as any);
  };

  const hasChats = !isLoading && chats.length > 0;

  return (
    <>
      <Stack.Screen options={buildForumChatHeaderOptions()} />

      <View style={styles.wrapper}>
        <ScrollView 
          contentContainerStyle={[
            styles.container,
            !hasChats && styles.containerEmpty
          ]}
          style={!hasChats && styles.scrollViewEmpty}
        >
          {isLoading ? null : hasChats ? (
            chats.map((chat) => (
              <ForumRow
                key={chat.id}
                title={chat.title}
                lastMessage={chat.lastMessage}
                avatarUri={chat.avatarUri}
                onPress={() => handleChatPress(chat.recipientId.toString())}
              />
            ))
          ) : null}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.color.appBackground,
  },
  container: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: theme.color.appBackground,
    gap: 8,
  },
  containerEmpty: {
    paddingTop: 0,
    minHeight: 0,
    backgroundColor: theme.color.appBackground,
  },
  scrollViewEmpty: {
    backgroundColor: theme.color.appBackground,
  },
});


