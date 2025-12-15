import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { TakePetPopupProps } from "@/types/TakePetProps";
import PrimaryButton from "../button/PrimaryButton";

export default function TakePetConfirmPopup({ visible, onClose }: TakePetPopupProps) {
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
            <Text style={{fontSize: 28, color: "#697c44"}}>×</Text>
          </Pressable>
          <Text style={styles.text}>
            Спасибо, что оставили заявку!{'\n'}
            Через некоторое время с вами свяжутся для уточнения подробностей
          </Text>
          <PrimaryButton
            title="Хорошо"
            onPress={onClose}
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
  text: {
    fontSize: 14,
    color: "#7B8154",
    marginTop: 18,
    marginBottom: 18,
    textAlign: "center",
    fontFamily: "Inter",
    fontWeight: 300,
  }
});
