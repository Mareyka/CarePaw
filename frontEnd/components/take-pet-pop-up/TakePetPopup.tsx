import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from "react-native";
import TakePetConfirmPopup from "./TakePetConfirmPopup";
import { TakePetPopupProps } from "@/types/TakePetProps";
import PrimaryButton from "../button/PrimaryButton";

export default function TakePetPopup({ visible, onClose }: TakePetPopupProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (showConfirm) {
    return (
      <TakePetConfirmPopup
        visible={visible}
        onClose={() => { setShowConfirm(false); onClose(); }}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.popupBg}>
        <View style={styles.popup}>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={{ fontSize: 28, color: "#697c44" }}>×</Text>
          </Pressable>
          <Text style={styles.title}>Ваши данные</Text>
          <TextInput
            style={styles.input}
            placeholder="Имя пользователя, эл. адрес"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="+375 (__) ___-__-__"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <PrimaryButton
            title="Оставить заявку"
            onPress={() => setShowConfirm(true)}
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
  }
});
