import { Typography } from "@/shared/ui/Typography";
import { ForumCategory as ForumCategoryType } from "@/types/forum";
import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ForumRow } from "../forum-row";

type ForumCategoryProps = {
  category: ForumCategoryType;
  onForumPress?: (forumId: string) => void;
};

export const ForumCategory = ({ category, onForumPress }: ForumCategoryProps) => {
  return (
    <View style={styles.block}>
      <Typography type="title" style={styles.sectionTitle}>
        {category.title}
      </Typography>
      {category.forums.map((forum) => (
        <ForumRow
          key={forum.id}
          title={forum.title}
          lastMessage={forum.lastMessage}
          avatarUri={forum.avatarUri}
          onPress={onForumPress ? () => onForumPress(forum.id) : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    gap: 16,
  },
  sectionTitle: {
    color: theme.color.background.darkGreen,
    fontSize: 18,
    marginBottom: 4,
  },
});

export default ForumCategory;

