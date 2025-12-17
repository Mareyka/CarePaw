import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  touched?: boolean; // для управления показом ошибки только после касания
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  error,
  touched,
  style,
  ...restProps
}: InputProps) {
  const showError = error && touched !== undefined ? touched : !!error;
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        showError && styles.inputWrapperError
      ]}>
        <TextInput
          style={[
            styles.input,
            showError && styles.inputError,
            style
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          {...restProps}
        />
      </View>
      {showError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5D684F',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    borderRadius: 15,
    backgroundColor: '#FFF8EF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperError: {
    shadowColor: '#dc3545',
    shadowOpacity: 0.2,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#4E5B3F',
    borderRadius: 15,
  },
  inputError: {
    // Сохраняем дизайн, но добавляем индикацию ошибки через wrapper
  },
  errorContainer: {
    marginTop: 4,
    marginLeft: 5,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    fontWeight: '500',
  },
});