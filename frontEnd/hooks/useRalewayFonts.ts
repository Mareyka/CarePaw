import { Raleway_100Thin } from "@expo-google-fonts/raleway/100Thin";
import { Raleway_100Thin_Italic } from "@expo-google-fonts/raleway/100Thin_Italic";
import { Raleway_200ExtraLight } from "@expo-google-fonts/raleway/200ExtraLight";
import { Raleway_200ExtraLight_Italic } from "@expo-google-fonts/raleway/200ExtraLight_Italic";
import { Raleway_300Light } from "@expo-google-fonts/raleway/300Light";
import { Raleway_300Light_Italic } from "@expo-google-fonts/raleway/300Light_Italic";
import { Raleway_400Regular } from "@expo-google-fonts/raleway/400Regular";
import { Raleway_400Regular_Italic } from "@expo-google-fonts/raleway/400Regular_Italic";
import { Raleway_500Medium } from "@expo-google-fonts/raleway/500Medium";
import { Raleway_500Medium_Italic } from "@expo-google-fonts/raleway/500Medium_Italic";
import { Raleway_600SemiBold } from "@expo-google-fonts/raleway/600SemiBold";
import { Raleway_600SemiBold_Italic } from "@expo-google-fonts/raleway/600SemiBold_Italic";
import { Raleway_700Bold } from "@expo-google-fonts/raleway/700Bold";
import { Raleway_700Bold_Italic } from "@expo-google-fonts/raleway/700Bold_Italic";
import { Raleway_800ExtraBold } from "@expo-google-fonts/raleway/800ExtraBold";
import { Raleway_800ExtraBold_Italic } from "@expo-google-fonts/raleway/800ExtraBold_Italic";
import { Raleway_900Black } from "@expo-google-fonts/raleway/900Black";
import { Raleway_900Black_Italic } from "@expo-google-fonts/raleway/900Black_Italic";
import { useFonts } from "@expo-google-fonts/raleway/useFonts";

export const useRalewayFonts = () => {
  let [areFontsLoaded, errorFontsLoaded] = useFonts({
    Raleway_100Thin,
    Raleway_200ExtraLight,
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Raleway_900Black,
    Raleway_100Thin_Italic,
    Raleway_200ExtraLight_Italic,
    Raleway_300Light_Italic,
    Raleway_400Regular_Italic,
    Raleway_500Medium_Italic,
    Raleway_600SemiBold_Italic,
    Raleway_700Bold_Italic,
    Raleway_800ExtraBold_Italic,
    Raleway_900Black_Italic,
  });

  return { areFontsLoaded, errorFontsLoaded };
};
