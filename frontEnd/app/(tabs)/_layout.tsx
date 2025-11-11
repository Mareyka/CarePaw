import { Tabs } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ChatIcon } from "@/assets/icons/ChatIcon";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { HapticTab } from "@/components/haptic-tab";
import { TabBarIcon } from "@/components/tab-bar-icon";
import { theme } from "@/constants/theme";
import { buildForumChatHeaderOptions, buildSearchHeaderOptions } from "@/shared/ui/header";

export default function TabLayout() {

  return (
    <Tabs
      initialRouteName={"search"}
      screenLayout={(props) => (
        <ScrollView style={styles.container} {...props} />
      )}
      screenOptions={{
        headerStatusBarHeight: 20,
        tabBarActiveTintColor: theme.color.background.default,
        tabBarInactiveTintColor: theme.color.background.unActive,
        headerShown: false,
        tabBarButton: HapticTab,
        title: "",
        tabBarItemStyle: {
          marginTop: 16,
          width: 48,
          height: 48,
          padding: 10,
          top: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarStyle: {
          height: 64,
          backgroundColor: theme.color.background.usual,
        },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          ...buildSearchHeaderOptions(),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon={<SearchIcon size={24} focused={focused} />}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="forums"
        options={{
          ...buildForumChatHeaderOptions(),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon={<ChatIcon size={24} focused={focused} />}
              focused={focused}
            />
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 24,
    paddingHorizontal: 8,
    backgroundColor: theme.color.appBackground,
  },
});
