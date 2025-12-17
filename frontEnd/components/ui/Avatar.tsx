import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

interface AvatarProps {
  source?: ImageSourcePropType;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ source, size = 60 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={source || require('../images/avatar.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;