import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OrDividerProps {
  text?: string;
}

export default function OrDivider({ text = 'или' }: OrDividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#5D684F',
  },
  text: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#4E5B3F',
  },
});