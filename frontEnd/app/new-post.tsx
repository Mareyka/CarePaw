import { buildDefaultHeaderOptions } from "@/shared/ui/header";
import { theme } from "@/constants/theme";
import { Typography } from "@/shared/ui/Typography";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LocationSelector } from "@/components/location-selector";
import { PostTypeSelector, PostType } from "@/components/post-type-selector";
import { useLocations } from "@/hooks/useLocations";
import { apiService } from "@/api/service";

export default function NewPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [postType, setPostType] = useState<PostType | null>(null);
  const { locations, isLoading, error } = useLocations();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ошибка", "Нужно разрешение на доступ к галерее");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    try {
      if (!image) {
        Alert.alert("Ошибка", "Выберите изображение");
        return;
      }
      if (!description.trim()) {
        Alert.alert("Ошибка", "Введите описание поста");
        return;
      }
      if (!selectedLocationId) {
        Alert.alert("Ошибка", "Выберите локацию");
        return;
      }
  
      const currentUser = apiService.getCurrentUserFromMemory();
      if (!currentUser) {
        Alert.alert("Ошибка", "Вы не авторизованы");
        return;
      }
  
      const isUrgently = postType === "urgent";
  
      console.log("Отправка поста:", {
        title: description,
        placeId: selectedLocationId,
        isUrgently,
        userId: currentUser.id,
        imageUri: image,
      });
  
      const newPost = await apiService.createPost({
        title: description,
        placeId: selectedLocationId,
        isUrgently,
        userId: currentUser.id,
        imageUri: image,
      });
  
      console.log("Пост создан:", newPost);
      router.replace('/(tabs)'); 
    } catch (error: any) {
      Alert.alert("Ошибка публикации", error.message || "Что-то пошло не так");
    }
  };


  return (
    <>
      <Stack.Screen
        options={buildDefaultHeaderOptions({ title: "Новая публикация" })}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Typography type="label" style={styles.placeholderText}>
                Нажмите, чтобы выбрать фото
              </Typography>
            </View>
          )}
        </Pressable>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите небольшое описание"
            placeholderTextColor={theme.color.text + "80"}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {isLoading && (
  <Typography type="label" style={{ textAlign: "center" }}>
    Загружаем локации…
  </Typography>
)}

{error && (
  <Typography type="label" style={{ color: "red", textAlign: "center" }}>
    Ошибка: {error}
  </Typography>
)}

{!isLoading && !error && (
  <LocationSelector
    locations={locations}
    selectedLocationId={selectedLocationId}
    onLocationSelect={setSelectedLocationId}
  />
)}

        <PostTypeSelector
          selectedType={postType}
          onTypeSelect={setPostType}
        />

        {/* Publish Button */}
        <Pressable style={styles.publishButton} onPress={handlePublish}>
          <Typography type="title" style={styles.publishButtonText}>
            Опубликовать
          </Typography>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.appBackground,
  },
  content: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: theme.color.background.default,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.color.background.lightGreen,
  },
  placeholderText: {
    color: theme.color.text,
    opacity: 0.6,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: theme.color.background.default,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 80,
  },
  input: {
    fontSize: 14,
    color: theme.color.text,
    textAlignVertical: "top",
  },
  publishButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: "#EEB16E",
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  publishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

