import SearchHeaderLeftIcon from "@/assets/icons/SearchHeaderLeftIcon";
import SearchHeaderRightIcon from "@/assets/icons/SearchHeaderRightIcon";
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon";
import { theme } from "@/constants/theme";
import { Typography } from "@/shared/ui/Typography";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function HeaderBackButton({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      style={{ paddingHorizontal: 12, paddingVertical: 8 }}
      hitSlop={8}
    >
      <ArrowLeftIcon size={26} />
    </Pressable>
  );
}

type HeaderOptionsArgs = {
  title: string;
};

export function buildDefaultHeaderOptions({ title }: HeaderOptionsArgs) {
  return {
    title,
    headerTitleStyle: { color: theme.color.lightText },
    headerStyle: { backgroundColor: theme.color.background.usual },
    headerShadowVisible: false,
    headerLeft: () => <HeaderBackButton />,
  } as const;
}

type SearchHeaderNavProps = {
  onPressMap?: () => void;
  onPressHome?: () => void;
  onPressUrgent?: () => void;
};

export function SearchHeaderNav({
  onPressMap,
  onPressHome,
  onPressUrgent,
}: SearchHeaderNavProps) {
  const router = useRouter();
  return (
    <View style={styles.searchHeaderContainer}>
      <SearchHeaderLeftIcon width={33} height={34} />

      <View style={styles.navCenter}>
        <Pressable onPress={onPressMap} hitSlop={8} style={styles.navButton}>
          <Text style={styles.navText}>Карта</Text>
        </Pressable>
        <Pressable
          onPress={onPressHome ?? (() => router.push("/"))}
          hitSlop={8}
          style={styles.navButton}
        >
          <Text style={styles.navText}>Главная</Text>
        </Pressable>
        <Pressable
          onPress={onPressUrgent}
          hitSlop={8}
          style={styles.navButton}
        >
          <Text style={styles.navText}>Срочное</Text>
        </Pressable>
      </View>

      <SearchHeaderRightIcon width={34} height={31} />
    </View>
  );
}

export function buildSearchHeaderOptions(props?: SearchHeaderNavProps) {
  return {
    headerShown: true,
    header: () => <SearchHeaderNav {...props} />,
    headerStyle: { backgroundColor: theme.color.background.usual },
    headerShadowVisible: false,
  } as const;
}

type ForumChatHeaderNavProps = {};

export function ForumChatHeaderNav({}: ForumChatHeaderNavProps) {
  const router = useRouter();
  const { mode } = useGlobalSearchParams<{ mode?: string }>();
  const isForums = (mode as string) !== "chats";
  const isChats = !isForums;
  return (
    <View style={styles.searchHeaderContainer}>
      <SearchHeaderLeftIcon width={33} height={34} />

      <View style={styles.navCenter}>
        <Pressable
          onPress={() => router.setParams({ mode: "forums" })}
          hitSlop={8}
          style={[styles.navButton, isForums ? styles.navButtonActive : null]}
        >
          <Text style={[styles.navText, isForums ? styles.navTextActive : null]}>
            Форумы
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.setParams({ mode: "chats" })}
          hitSlop={8}
          style={[styles.navButton, isChats ? styles.navButtonActive : null]}
        >
          <Text style={[styles.navText, isChats ? styles.navTextActive : null]}>
            Чаты
          </Text>
        </Pressable>
      </View>

      <SearchHeaderRightIcon width={34} height={31} />
    </View>
  );
}

export function buildForumChatHeaderOptions() {
  return {
    headerShown: true,
    header: () => <ForumChatHeaderNav />,
    headerStyle: { backgroundColor: theme.color.background.usual },
    headerShadowVisible: false,
  } as const;
}

type ChatHeaderProps = {
  name: string;
  avatarUri?: string;
};

export function ChatHeader({ name, avatarUri }: ChatHeaderProps) {
  return (
    <View style={styles.chatHeaderContainer}>
      <HeaderBackButton />
      <View style={styles.chatHeaderContent}>
        <Typography type="title" style={styles.chatHeaderName}>
          {name}
        </Typography>
      </View>
    </View>
  );
}

export function buildChatHeaderOptions({ name, avatarUri }: ChatHeaderProps) {
  return {
    headerShown: true,
    header: () => <ChatHeader name={name} avatarUri={avatarUri} />,
    headerStyle: { backgroundColor: theme.color.background.usual },
    headerShadowVisible: false,
  } as const;
}

const styles = StyleSheet.create({
  searchHeaderContainer: {
    height: 56,
    backgroundColor: theme.color.background.usual,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    position: "relative",
  },
  navCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 24,
  },
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  navText: {
    color: theme.color.lightText,
    fontSize: 16,
  },
  navButtonActive: {
    backgroundColor: theme.color.appBackground,
  },
  navTextActive: {
    color: theme.color.background.darkGreen,
  },
  chatHeaderContainer: {
    height: 56,
    backgroundColor: theme.color.background.usual,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  chatHeaderContent: {
    flex: 1,
    marginLeft: 8,
  },
  chatHeaderName: {
    color: theme.color.background.default,
    fontSize: 18,
  },
});
