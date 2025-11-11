import { theme } from "@/constants/theme";
import { Typography } from "@/shared/ui/Typography";
import React from "react";
import { StyleSheet, View } from "react-native";

type UserCardProps = {
  username?: string;
  role?: string;
  width?: number; // card width and green block size (square), defaults to 125
};

export default function UserCard({
  username = "_.username._",
  role = "врач",
  width = 140,
}: UserCardProps) {
  const avatarDiameter = Math.round(width * 0.6);

  return (
    <View style={[styles.container]}> 
      <View style={[styles.greenBlock, { width, height: width }]}> 
        <View
          style={[
            styles.avatar,
            {
              width: avatarDiameter,
              height: avatarDiameter,
              borderRadius: Math.round(avatarDiameter / 2),
            },
          ]}
        />

        <Typography style={styles.username} type="title">
          {username}
        </Typography>
      </View>

      <Typography style={styles.role} type="label">
        {role}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  greenBlock: {
    backgroundColor: theme.color.background.usual,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  avatar: {
    backgroundColor: theme.color.background.default,
    marginTop: 12,
  },
  username: {
    marginTop: 8,
    color: theme.color.text,
  },
  role: {
    alignSelf: "flex-start",
    marginLeft: 8,
    marginTop: 6,
    color: theme.color.text,
  },
});


