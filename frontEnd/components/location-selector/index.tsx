import { Typography } from "@/shared/ui/Typography";
import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton } from "@/shared/ui/radio-button";

export type Location = {
  id: string;
  name: string;
};

type LocationSelectorProps = {
  locations: Location[];
  selectedLocationId: string | null;
  onLocationSelect: (locationId: string) => void;
};

export const LocationSelector = ({
  locations,
  selectedLocationId,
  onLocationSelect,
}: LocationSelectorProps) => {
  return (
    <View style={styles.section}>
      <Typography type="title" style={styles.sectionTitle}>
        Добавить место
      </Typography>
      <View style={styles.buttonRow}>
        {locations.map((location) => (
          <RadioButton
            key={location.id}
            label={location.name}
            selected={selectedLocationId === location.id}
            onPress={() => onLocationSelect(location.id)}
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

