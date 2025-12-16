import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SocialButtonProps {
  icon: string;
  onPress: () => void;
}

export default function SocialButton({ icon, onPress }: SocialButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF8EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4E5B3F',

    shadowColor: '#000000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E5B3F',
  },
});