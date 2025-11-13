import { theme } from "@/constants/theme";
import { buildDefaultHeaderOptions } from "@/shared/ui/header";
import { ThemedButton } from "@/shared/ui/themed-button";
import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NavigateToAllPages() {
    return (
        <>
            <Stack.Screen
                options={buildDefaultHeaderOptions({ title: "Временные кнопки" })}
            />
            <View style={styles.wrapper}>
                <View style={styles.listItem}>
                    <ThemedButton onPress={() => router.push("/(tabs)/forums")} textAlign="center">
                        Форумы/чаты
                    </ThemedButton>
                </View>
                <View style={styles.listItem}>
                    <ThemedButton onPress={() => router.push("/(tabs)/search")} textAlign="center">
                        Поиск
                    </ThemedButton>
                </View>
                <View style={styles.listItem}>
                    <ThemedButton onPress={() => router.push("/new-post")} textAlign="center">
                        Добавление поста
                    </ThemedButton>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.color.background.default,
        paddingHorizontal: 20,
        paddingTop: 32,
    },
    title: {
        marginBottom: 22,
    },
    listItem: {
        marginBottom: 22,
    },
});