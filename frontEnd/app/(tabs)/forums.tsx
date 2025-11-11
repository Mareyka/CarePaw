import { theme } from "@/constants/theme";
import { Typography } from "@/shared/ui/Typography";
import { buildForumChatHeaderOptions } from "@/shared/ui/header";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ForumsOrChatsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const activeMode = (mode as string) || "forums";

  return (
    <>
      <Stack.Screen options={buildForumChatHeaderOptions()} />

      {activeMode === "forums" ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.block}>
            <Typography type="title" style={styles.sectionTitle}>
              Дрессировка
            </Typography>
            {["Когда начинать дресс...", "Основы дрессировки", "Техники дрессировки"].map(
              (t, i) => (
                <View key={i} style={styles.forumRow}>
                  <View style={styles.circle} />
                  <View style={{ flex: 1 }}>
                    <Typography type="title" style={styles.rowTitle}>
                      {t}
                    </Typography>
                    <Typography type="label">Последнее сообщение</Typography>
                  </View>
                </View>
              )
            )}
          </View>
          <View style={styles.block}>
            <Typography type="title" style={styles.sectionTitle}>
              Вакцинация
            </Typography>
            {["Стоит ли вакцинировать", "Прививка от клещей"].map((t, i) => (
              <View key={i} style={styles.forumRow}>
                <View style={styles.circle} />
                <View style={{ flex: 1 }}>
                  <Typography type="title" style={styles.rowTitle}>
                    {t}
                  </Typography>
                  <Typography type="label">Последнее сообщение</Typography>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.block}>
            {new Array(10).fill(0).map((_, i) => (
              <View key={i} style={styles.forumRow}>
                <View style={styles.circle} />
                <View style={{ flex: 1 }}>
                  <Typography type="title" style={styles.rowTitle}>
                    Чаты
                  </Typography>
                  <Typography type="label">Последнее сообщение</Typography>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 24,
    backgroundColor: theme.color.appBackground,
    gap: 16,
  },
  block: {
    gap: 16,
  },
  sectionTitle: {
    color: theme.color.background.darkGreen,
    fontSize: 18,
    marginBottom: 4,
  },
  forumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomColor: "rgba(0,0,0,0.08)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.color.background.lightGreen,
  },
  rowTitle: {
    fontSize: 16,
    color: theme.color.background.darkGreen,
  },
});


