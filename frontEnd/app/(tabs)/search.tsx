import UserCard from "@/components/userCard";
import { theme } from "@/constants/theme";
import SearchInput from "@/shared/ui/search-input";
import Header from "@/components/Header";
import { Typography } from "@/shared/ui/Typography";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function SearchScreen() {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.searchInputContainer}>
              <SearchInput />
            </View>
            <ScrollView
              style={styles.scrollerWrapper}
              contentContainerStyle={styles.scroller}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {new Array(10).fill(0).map((item, index) => {
                return (
                  <View key={index}>
                    <UserCard />
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.otherSection}>
              <Typography type="title" style={styles.sectionTitle}>
                Все остальное
              </Typography>
              <View style={styles.grid}>
                <Pressable style={[styles.card, styles.cardLight]}>
                  <Typography type="title" style={styles.cardText}>
                    Для тебя
                  </Typography>
                </Pressable>
                <Pressable style={[styles.card, styles.cardGreen]}>
                  <Typography type="title" style={styles.cardText}>
                    Врачи
                  </Typography>
                </Pressable>
                <Pressable style={[styles.card, styles.cardGreen]}>
                  <Typography type="title" style={styles.cardText}>
                    Питомцы
                  </Typography>
                </Pressable>
                <Pressable style={[styles.card, styles.cardLight]}>
                  <Typography type="title" style={styles.cardText}>
                    Лакомства
                  </Typography>
                </Pressable>
              </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({

  searchInputContainer: {
    marginTop: 16,
    paddingHorizontal:12,
  },
    scrollerWrapper: {
      marginTop: 16,
      paddingHorizontal:12,
      maxHeight: 180,
    },
    scroller: {
      flexDirection: "row",
      gap: 16,
    },
    bedImage: {
      width: 103,
      height: 103,
    },
    childImage: {
      width: 143,
      height: 143,
    },
    gardenGridContainer: {
      marginTop: 24,
      flexDirection: "row",
      gap: 16,
      marginBottom: 64,
    },
    gardenGridColumn: {
      flexDirection: "column",
      gap: 16,
    },
    gardenImageSmall: {
      width: 100,
      height: 50,
      borderRadius: 8,
    },
    gardenImageMedium: {
      width: 100,
      height: 100,
      borderRadius: 12,
    },
    gardenImageLarge: {
      width: 100,
      height: 150,
      borderRadius: 16,
    },
    fab: {
      position: "absolute",
      alignSelf: "flex-end",
      right: 16,
      bottom: 96,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.color.background.usual,
      alignItems: "center",
      justifyContent: "center",
    },
    fabInner: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.color.background.default,
    },
    otherSection: {
      marginTop: 24,
      paddingHorizontal: 12,
      paddingBottom: 24,
    },
    sectionTitle: {
      marginBottom: 12,
      color: theme.color.background.darkGreen,
      fontSize: 20,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      width: "48%",
      height: 64,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    cardLight: {
      backgroundColor: theme.color.background.default,
    },
    cardGreen: {
      backgroundColor: theme.color.background.lightGreen,
    },
    cardText: {
      color: theme.color.background.darkGreen,
    },
    container: {
      backgroundColor: theme.color.appBackground,
      height: '100%',
      paddingBottom: 52,
    },
  });
