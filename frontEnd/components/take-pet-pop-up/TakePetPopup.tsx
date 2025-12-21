import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from "react-native";
import TakePetConfirmPopup from "./TakePetConfirmPopup";
import { TakePetPopupProps } from "@/types/TakePetProps";
import PrimaryButton from "../button/PrimaryButton";

export default function TakePetPopup({ visible, onClose }: TakePetPopupProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 7;
  };

  const handleSubmit = () => {
    const nextErrors = { name: "", phone: "" };
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      nextErrors.name = "Введите имя или email.";
    } else if (trimmedName.includes("@") && !isValidEmail(trimmedName)) {
      nextErrors.name = "Некорректный email.";
    }

    if (!trimmedPhone) {
      nextErrors.phone = "Введите номер телефона.";
    } else if (!isValidPhone(trimmedPhone)) {
      nextErrors.phone = "Некорректный номер.";
    }

    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;
    setShowConfirm(true);
  };

  const handleClose = () => {
    setErrors({ name: "", phone: "" });
    setShowConfirm(false);
    onClose();
  };

  if (showConfirm) {
    return (
      <TakePetConfirmPopup
        visible={visible}
        onClose={handleClose}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.popupBg}>
        <View style={styles.popup}>
          <Pressable style={styles.close} onPress={handleClose}>
            <Text style={{ fontSize: 28, color: "#697c44" }}>×</Text>
          </Pressable>
          <Text style={styles.title}>Ваши данные</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Электронный адрес"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            placeholder="+375 (__) ___-__-__"
            value={phone}
            onChangeText={(value) => {
              setPhone(value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            keyboardType="phone-pad"
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          <PrimaryButton
            title="Оставить заявку"
            onPress={handleSubmit}
            style={{ marginTop: 8 }}
            textStyle={{ fontSize: 17 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popupBg: {
    flex: 1,
    backgroundColor: "rgba(100,100,100,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#ECE1D1",
    borderRadius: 22,
    padding: 29,
    width: 300,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 7,
    position: "relative"
  },
  close: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 20,
    color: "#7B8154",
    alignSelf: "center",
    fontFamily: "inglobal",
  },
  input: {
    backgroundColor: "#FFF8EF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 12,
    fontFamily: "inglobal",
    color: "#7B8154",

    shadowColor: "#A47440",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 6,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#C35A3A",
  },
  errorText: {
    color: "#C35A3A",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
});
