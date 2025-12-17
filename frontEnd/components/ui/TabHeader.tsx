import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabHeaderProps {
  tabs: {
    label: string;
    isActive: boolean;
    onPress: () => void;
  }[];
}

export default function TabHeader({ tabs }: TabHeaderProps) {
  return (
    <View style={styles.header}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            tab.isActive && styles.tabActive
          ]}
          onPress={tab.onPress}
        >
          <Text style={[
            styles.tabText,
            tab.isActive && styles.tabTextActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor:'#ECE1D1',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabText: {
    fontSize: 16,
    color: '#FFF9F1',
  },
  tabTextActive: {
    color: '#434B39',
    fontWeight: '600',
  },
});