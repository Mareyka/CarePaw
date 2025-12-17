import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IconButtonProps {
  icon: string;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={icon} size={24} color="#333" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default IconButton;