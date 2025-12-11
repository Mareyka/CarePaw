import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// Типы для пропсов
interface TabBar_buttonProps {
    icon: React.ReactElement<{ color?: string }>; // Иконка с опциональным пропсом color
    isActive: boolean;
    onPress: () => void;
}

const TabBar_button = ({ icon, isActive, onPress }: TabBar_buttonProps) => {
    return(
        <TouchableOpacity 
            style={[
                styles.button,
                isActive && styles.activeButton
            ]} 
            onPress={onPress}
        >
            {React.cloneElement(icon, {
                color: isActive ? '#FFFFFF' : '#5D684F'
            })}
        </TouchableOpacity>
    );
};

export default TabBar_button;

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#A4B88C',
        shadowColor: '#5D684F',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
    },
    activeButton: { 
        shadowColor: '#A4B88C',
    },
});