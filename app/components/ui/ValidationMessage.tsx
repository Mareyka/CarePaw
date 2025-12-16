// components/ui/ValidationMessage.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ValidationMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'success';
  visible?: boolean;
}

export default function ValidationMessage({ 
  message, 
  type = 'error',
  visible = true 
}: ValidationMessageProps) {
  if (!visible || !message) return null;
  
  const color = {
    error: '#DC2626',
    warning: '#D97706',
    success: '#059669'
  }[type];
  
  return (
    <Text style={[styles.message, { color }]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
});