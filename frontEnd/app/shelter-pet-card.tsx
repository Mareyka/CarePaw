import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import PrimaryButton from '@/components/button/PrimaryButton';
import TakePetPopup from '@/components/take-pet-pop-up/TakePetPopup';
import { useAuth } from '@/contexts/AuthContext';
import {
  createShelterAnimal,
  CreateShelterAnimalInput,
  getShelterAnimalById,
  resolveShelterAnimalPhotoUrl,
  ShelterAnimal,
} from '@/api/shelter-animals';

export default function ShelterPetCard() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { animalId, mode } = useLocalSearchParams<{ animalId?: string; mode?: string }>();

  const isCreateMode = !animalId || mode === 'create';
  const isShelterOwner = currentUser?.role === 'SHELTER';

  const goBackSafe = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const [loading, setLoading] = useState(!isCreateMode);
  const [isSaving, setIsSaving] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [animal, setAnimal] = useState<ShelterAnimal | null>(null);

  const [form, setForm] = useState<CreateShelterAnimalInput>({
    name: '',
    species: '',
    breed: '',
    age: undefined,
    description: '',
    photoUrl: null,
    shelterAddress: '',
    shelterEmail: '',
    shelterPhone: '',
    shelterId: currentUser?.id ?? 0,
    adopted: false,
  });

  const photoUri = useMemo(() => {
    if (isCreateMode) return resolveShelterAnimalPhotoUrl(form.photoUrl) || form.photoUrl || null;
    return resolveShelterAnimalPhotoUrl(animal?.photoUrl) || animal?.photoUrl || null;
  }, [animal?.photoUrl, form.photoUrl, isCreateMode]);

  useEffect(() => {
    if (isCreateMode) return;
    (async () => {
      try {
        setLoading(true);
        const loaded = await getShelterAnimalById(animalId);
        setAnimal(loaded);
      } catch (error) {
        console.error('Error loading shelter animal:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [animalId, isCreateMode]);

  const onCreate = async () => {
    if (isSaving) return;
    if (!currentUser?.id || currentUser.role !== 'SHELTER') {
      Alert.alert('Ошибка', 'Добавлять животных может только приют.');
      return;
    }
    if (!form.name.trim()) {
      Alert.alert('Проверьте данные', 'Имя обязательно.');
      return;
    }

    setIsSaving(true);
    try {
      await createShelterAnimal({
        ...form,
        name: form.name.trim(),
        species: form.species?.trim() || undefined,
        breed: form.breed?.trim() || undefined,
        description: form.description?.trim() || undefined,
        shelterAddress: form.shelterAddress?.trim() || undefined,
        shelterEmail: form.shelterEmail?.trim() || undefined,
        shelterPhone: form.shelterPhone?.trim() || undefined,
        shelterId: currentUser.id,
        adopted: false,
      });
      goBackSafe();
    } catch (error) {
      console.error('Error creating shelter animal:', error);
      const message = error instanceof Error ? error.message : 'Не удалось сохранить.';
      Alert.alert('Ошибка', message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.backdrop}>
        <ActivityIndicator size="large" color="#A4B88C" />
      </View>
    );
  }

  return (
    <View style={styles.backdrop}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.card}>
        <TouchableOpacity style={styles.close} onPress={goBackSafe}>
          <Text style={{ fontSize: 28, color: '#697c44' }}>×</Text>
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Image source={require('../assets/images/default_avatar.png')} style={styles.avatarImage} />
          )}
        </View>

        <Text style={styles.title}>{isCreateMode ? 'Новое животное приюта' : animal?.name}</Text>

        <View style={styles.line} />

        {isCreateMode ? (
          <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Имя *</Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
              placeholder="Гриша"
              placeholderTextColor="#9AA08F"
              style={styles.input}
            />

            <Text style={styles.label}>Вид</Text>
            <TextInput
              value={form.species}
              onChangeText={(v) => setForm((p) => ({ ...p, species: v }))}
              placeholder="Кот"
              placeholderTextColor="#9AA08F"
              style={styles.input}
            />

            <Text style={styles.label}>Порода</Text>
            <TextInput
              value={form.breed}
              onChangeText={(v) => setForm((p) => ({ ...p, breed: v }))}
              placeholder="Ориентал"
              placeholderTextColor="#9AA08F"
              style={styles.input}
            />

            <Text style={styles.label}>Возраст (лет)</Text>
            <TextInput
              value={form.age?.toString() ?? ''}
              onChangeText={(v) => setForm((p) => ({ ...p, age: v ? Number(v) : undefined }))}
              placeholder="2"
              placeholderTextColor="#9AA08F"
              style={styles.input}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Описание</Text>
            <TextInput
              value={form.description ?? ''}
              onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
              placeholder="Короткое описание"
              placeholderTextColor="#9AA08F"
              style={[styles.input, { height: 90 }]}
              multiline
            />

            <Text style={styles.label}>Фото (URL)</Text>
            <TextInput
              value={form.photoUrl ?? ''}
              onChangeText={(v) => setForm((p) => ({ ...p, photoUrl: v }))}
              placeholder="https://..."
              placeholderTextColor="#9AA08F"
              style={styles.input}
              autoCapitalize="none"
            />

            <View style={styles.line} />

            <Text style={styles.label}>Адрес приюта</Text>
            <TextInput
              value={form.shelterAddress ?? ''}
              onChangeText={(v) => setForm((p) => ({ ...p, shelterAddress: v }))}
              placeholder="Адрес"
              placeholderTextColor="#9AA08F"
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={form.shelterEmail ?? ''}
              onChangeText={(v) => setForm((p) => ({ ...p, shelterEmail: v }))}
              placeholder="example@mail.com"
              placeholderTextColor="#9AA08F"
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Телефон</Text>
            <TextInput
              value={form.shelterPhone ?? ''}
              onChangeText={(v) => setForm((p) => ({ ...p, shelterPhone: v }))}
              placeholder="+375..."
              placeholderTextColor="#9AA08F"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <PrimaryButton
              title={isSaving ? 'Сохранение…' : 'Сохранить'}
              onPress={onCreate}
              style={{ marginTop: 14 }}
              textStyle={{ fontSize: 18 }}
            />
          </ScrollView>
        ) : (
          <>
            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>Вид: {animal?.species || 'Не указан'}</Text>
              <Text style={styles.infoText}>Порода: {animal?.breed || 'Не указана'}</Text>
              <Text style={styles.infoText}>Возраст: {animal?.age ?? '—'}</Text>
              {!!animal?.description && <Text style={styles.infoText}>Описание: {animal.description}</Text>}
            </View>

            <View style={styles.line} />

            <View style={styles.infoBlock}>
              {!!animal?.shelterAddress && <Text style={styles.infoText}>Адрес: {animal.shelterAddress}</Text>}
              {!!animal?.shelterEmail && <Text style={styles.infoText}>Email: {animal.shelterEmail}</Text>}
              {!!animal?.shelterPhone && <Text style={styles.infoText}>Телефон: {animal.shelterPhone}</Text>}
            </View>

            {!isShelterOwner && (
              <>
                <PrimaryButton
                  title="Забрать"
                  onPress={() => setPopupVisible(true)}
                  style={{ marginTop: 14 }}
                  textStyle={{ fontSize: 18 }}
                />
                <TakePetPopup visible={popupVisible} onClose={() => setPopupVisible(false)} />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: '#FFF8E8',
    width: '90%',
    maxWidth: 420,
    padding: 22,
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
  title: {
    alignSelf: 'center',
    fontWeight: '800',
    marginVertical: 10,
    color: '#4E5B3F',
    fontSize: 18,
    fontFamily: 'inglobal',
    textAlign: 'center',
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
    marginVertical: 2,
    fontSize: 15,
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
});

