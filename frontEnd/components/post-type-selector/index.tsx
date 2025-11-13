import { Typography } from "@/shared/ui/Typography";
import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton } from "@/shared/ui/radio-button";

export type PostType = "urgent" | "publication";

type PostTypeSelectorProps = {
  selectedType: PostType | null;
  onTypeSelect: (type: PostType) => void;
};

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "urgent", label: "Срочное" },
  { value: "publication", label: "Публикация" },
];

export const PostTypeSelector = ({
  selectedType,
  onTypeSelect,
}: PostTypeSelectorProps) => {
  return (
    <View style={styles.section}>
      <Typography type="title" style={styles.sectionTitle}>
        Тип публикации
      </Typography>
      <View style={styles.buttonRow}>
        {POST_TYPES.map((type) => (
          <RadioButton
            key={type.value}
            label={type.label}
            selected={selectedType === type.value}
            onPress={() => onTypeSelect(type.value)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.color.background.darkGreen,
    marginBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.color.background.darkGreen,
    borderBottomColor: theme.color.background.darkGreen,
    paddingVertical: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
});

