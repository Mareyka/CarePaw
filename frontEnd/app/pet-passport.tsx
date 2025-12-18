import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '@/components/button/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import {
  createPet,
  type CreatePetInput,
  getPetById,
  type Pet,
  resolvePetPhotoUrl,
  type UploadPhotoAsset,
  uploadPetPhoto,
} from '@/api/pets';

export default function PetPassport() {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const goBackSafe = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const { petId, mode } = useLocalSearchParams<{ petId?: string; mode?: string }>();
  const isCreateMode = !petId || mode === 'create';

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(!isCreateMode);
  const [isSaving, setIsSaving] = useState(false);

  const [photoAsset, setPhotoAsset] = useState<UploadPhotoAsset | null>(null);
  const [form, setForm] = useState<CreatePetInput>({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    sterilized: false,
    vaccinated: false,
    dewormed: false,
    photoUrl: null,
  });

  const visiblePhotoUri = useMemo(() => {
    if (photoAsset?.uri) return photoAsset.uri;
    return resolvePetPhotoUrl(pet?.photoUrl) || null;
  }, [photoAsset?.uri, pet?.photoUrl]);

  useEffect(() => {
    if (isCreateMode) return;

    (async () => {
      try {
        setLoading(true);
        const loaded = await getPetById(petId);
        setPet(loaded);
      } catch (error) {
        console.error('Error fetching pet details:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [isCreateMode, petId]);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Доступ к галерее', 'Нужен доступ к галерее, чтобы выбрать фото.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;
    const first = result.assets[0];
    if (!first?.uri) return;
    setPhotoAsset({
      uri: first.uri,
      fileName: (first as any).fileName ?? null,
      mimeType: (first as any).mimeType ?? null,
      file: (first as any).file ?? null,
    });
  };

  const onSave = async () => {
    if (isSaving) return;

    const userId = currentUser?.id;
    if (!userId) {
      Alert.alert('Ошибка', 'Нужно быть авторизованным, чтобы добавить питомца.');
      return;
    }

    if (!form.name.trim()) {
      Alert.alert('Проверьте данные', 'Поле "Имя" обязательно.');
      return;
    }

    setIsSaving(true);
    try {
      const created = await createPet(userId, {
        ...form,
        name: form.name.trim(),
        species: form.species?.trim() || undefined,
        breed: form.breed?.trim() || undefined,
        dateOfBirth: form.dateOfBirth?.trim() || undefined,
      });

      if (photoAsset?.uri) {
        await uploadPetPhoto(created.id, photoAsset);
      }

      router.back();
    } catch (error) {
      console.error('Error creating pet:', error);
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      Alert.alert('Ошибка', message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A4B88C" />
      </View>
    );
  }

  if (!isCreateMode && !pet) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text>Животное не найдено</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ marginTop: 20, color: 'blue' }}>Назад</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.card}>
        <TouchableOpacity style={styles.close} onPress={goBackSafe}>
          <Text style={{ fontSize: 28, color: '#697c44' }}>×</Text>
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          {visiblePhotoUri ? (
            <Image source={{ uri: visiblePhotoUri }} style={styles.avatarImage} />
          ) : (
            <Image source={require('../assets/images/default_avatar.png')} style={styles.avatarImage} />
          )}
        </View>

        {isCreateMode ? (
          <Text style={styles.petName}>Новый питомец</Text>
        ) : (
          <Text style={styles.petName}>{pet?.name}</Text>
        )}

        <View style={styles.line} />

        {isCreateMode ? (
          <>
            <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
              <Text style={styles.photoButtonText}>{photoAsset ? 'Сменить фото' : 'Выбрать фото'}</Text>
            </TouchableOpacity>

            <View style={styles.formBlock}>
              <Text style={styles.label}>Имя *</Text>
              <TextInput
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                placeholder="Барсик"
                placeholderTextColor="#9AA08F"
                style={styles.input}
              />

              <Text style={styles.label}>Вид</Text>
              <TextInput
                value={form.species}
                onChangeText={(text) => setForm((prev) => ({ ...prev, species: text }))}
                placeholder="кот"
                placeholderTextColor="#9AA08F"
                style={styles.input}
              />

              <Text style={styles.label}>Порода</Text>
              <TextInput
                value={form.breed}
                onChangeText={(text) => setForm((prev) => ({ ...prev, breed: text }))}
                placeholder="дворовый"
                placeholderTextColor="#9AA08F"
                style={styles.input}
              />

              <Text style={styles.label}>Дата рождения</Text>
              <TextInput
                value={form.dateOfBirth}
                onChangeText={(text) => setForm((prev) => ({ ...prev, dateOfBirth: text }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9AA08F"
                style={styles.input}
                autoCapitalize="none"
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Прививки</Text>
                <Switch
                  value={!!form.vaccinated}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, vaccinated: value }))}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Стерилизован</Text>
                <Switch
                  value={!!form.sterilized}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, sterilized: value }))}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Глистогонные</Text>
                <Switch
                  value={!!form.dewormed}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, dewormed: value }))}
                />
              </View>

              <PrimaryButton
                title={isSaving ? 'Сохранение…' : 'Сохранить'}
                onPress={onSave}
                style={{ marginTop: 14 }}
                textStyle={{ fontSize: 19 }}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>Вид: {pet?.species || 'Не указан'}</Text>
              <Text style={styles.infoText}>Порода: {pet?.breed || 'Не указана'}</Text>
              <Text style={styles.infoText}>Дата рождения: {pet?.dateOfBirth || 'Не указана'}</Text>
            </View>

            <View style={styles.line} />

            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>Прививки: {pet?.vaccinated ? '✅ Да' : '❌ Нет'}</Text>
              <Text style={styles.infoText}>Стерилизован: {pet?.sterilized ? '✅ Да' : '❌ Нет'}</Text>
              <Text style={styles.infoText}>Глистогонные: {pet?.dewormed ? '✅ Да' : '❌ Нет'}</Text>
            </View>

            <PrimaryButton
              title="Календарь"
              onPress={() => router.push({ pathname: '/pet-calendar', params: { petId: pet?.id } })}
              style={{ marginTop: 14 }}
              textStyle={{ fontSize: 19 }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: '#FFF8E8',
    width: '90%',
    maxWidth: 400,
    padding: 26,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  close: {
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 2,
  },
  avatarCircle: {
    alignSelf: 'center',
    backgroundColor: '#A4B88C',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  petName: {
    alignSelf: 'center',
    fontWeight: '800',
    marginVertical: 8,
    color: '#4E5B3F',
    fontSize: 20,
    fontFamily: 'inglobal',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  infoBlock: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#4E5B3F',
    marginVertical: 1,
    fontSize: 16,
  },
  photoButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D0C7BA',
  },
  photoButtonText: {
    color: '#4E5B3F',
    fontWeight: '600',
  },
  formBlock: {
    marginTop: 10,
  },
  label: {
    color: '#4E5B3F',
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0C7BA',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#4E5B3F',
    backgroundColor: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  switchLabel: {
    color: '#4E5B3F',
    fontSize: 16,
  },
});
