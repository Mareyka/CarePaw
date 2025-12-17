import React from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  ImageSourcePropType,
  Dimensions,
} from "react-native";

type PostCardProps = {
  image: string | ImageSourcePropType;
  onPress?: () => void;
  size?: number;
  showOverlay?: boolean;
  likes?: number;
};

// Убрали H_PADDING, будем считать без padding
export default function PostCard({
  image,
  onPress,
  size,
  showOverlay = false,
  likes = 0,
}: PostCardProps) {
  const screenWidth = Dimensions.get("window").width;
  
  // 1 пост = ровно 1/3 экрана (без учета padding)
  const defaultItemSize = Math.floor(screenWidth / 3);
  const itemSize = size ?? defaultItemSize;

  const imageSource =
    typeof image === "string" ? { uri: image } : (image as ImageSourcePropType);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.wrapper, { 
        width: itemSize, 
        height: itemSize,
      }]}
    >
      <Image 
        source={imageSource} 
        style={[styles.image, { 
          width: itemSize, 
          height: itemSize 
        }]} 
      />

      {showOverlay && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>❤ {likes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#eee",
    overflow: "hidden",
    flex: 1, // Каждый элемент занимает равную долю
    aspectRatio: 1, // Сохраняем квадратную форму
  },
  image: {
    resizeMode: "cover",
    flex: 1,
  },
  overlay: {
    position: "absolute",
    left: 6,
    bottom: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  overlayText: {
    color: "#fff",
    fontSize: 12,
  },
});