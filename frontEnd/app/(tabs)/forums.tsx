import { theme } from "@/constants/theme";
import { buildForumChatHeaderOptions } from "@/shared/ui/header";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ForumCategory } from "@/components/forum-category";
import { ForumRow } from "@/components/forum-row";
import { useForums } from "@/hooks/useForums";
import SearchInput from "@/shared/ui/search-input";

export default function ForumsOrChatsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const activeMode = (mode as string) || "forums";
  const router = useRouter();
  const { categories, chats, isLoading } = useForums(
    activeMode === "forums" ? "forums" : "chats"
  );

  const handleForumPress = (forumId: string) => {
    if (activeMode === "chats") {
      router.push({
        pathname: "/chat/[id]",
        params: { id: forumId },
      } as any);
    } else {
      console.log("Navigate to forum:", forumId);
    }
  };

  return (
    <>
      <Stack.Screen options={buildForumChatHeaderOptions()} />

      {activeMode === "forums" ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View>
              <SearchInput
               placeholder = {"Поиск по тематике..."}/>
            </View>
          {isLoading ? (
            <View />
          ) : (
            categories.map((category) => (
              <ForumCategory
                key={category.id}
                category={category}
                onForumPress={handleForumPress}
              />
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            {isLoading
              ? null
              : chats.map((chat) => (
                  <ForumRow
                    key={chat.id}
                    title={chat.title}
                    lastMessage={chat.lastMessage}
                    avatarUri={chat.avatarUri}
                    onPress={() => handleForumPress(chat.recipientId.toString())}
                  />
                ))}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: theme.color.appBackground,
    gap: 8,
  },
});


