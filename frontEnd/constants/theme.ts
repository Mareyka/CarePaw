// constants/theme.ts - ОДИН единый файл
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform, StyleSheet } from "react-native";

export const theme = {
  color: {
    background: {
      default: "#FFF9F1",
      unActive: "#5D684F",
      pressed: "#556C64",
      usual: "#A4B88C",
      disabled: "#C4D2CC",
      darkGreen: "#5D684F",
      lightGreen: "#D0D1B5",
    },
    text: "#5D684F",
    lightText: "#FFF8E8",
    appBackground: "#ECE1D1",
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  colors: {
    primary: '#A4B88C',
    secondary: '#5D684F',
    tertiary: '#EEB16E',
    quaternary: '#E7851A',
    base: '#ECE1D1',
    text: '#333333',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const CustomFonts = {
  Inter: {
    regular: 'Inter-Regular',
    bold: 'Inter-Bold',
    medium: 'Inter-Medium',
    light: 'Inter-Light',
    semiBold: 'Inter-SemiBold',
  },
  Inglobal: {
    regular: 'inglobal',
    bold: 'inglobalb',
  },
};

export const GlobalStyles = StyleSheet.create({
  // Текстовые стили
  text: {
    fontSize: 16,
    fontFamily: CustomFonts.Inter.regular,
    color: theme.colors.text,
  },
  textSmall: {
    fontSize: 12,
    fontFamily: CustomFonts.Inter.regular,
    color: theme.colors.text,
  },
  textLarge: {
    fontSize: 20,
    fontFamily: CustomFonts.Inter.regular,
    color: theme.colors.text,
  },
  textBold: {
    fontSize: 16,
    fontFamily: CustomFonts.Inter.bold,
    color: theme.colors.text,
  },
  textSpecial: {
    fontSize: 16,
    fontFamily: CustomFonts.Inglobal.regular,
    color: theme.colors.text,
  },
  textSpecialBold: {
    fontSize: 20,
    fontFamily: CustomFonts.Inglobal.bold,
    color: theme.colors.text,
  },
  
  // Цветовые стили
  acsentColor: {
    color: theme.colors.secondary,
  },
  tertiaryColor: {
    color: theme.colors.tertiary,
  },
  baseColor: {
    color: theme.colors.primary,
  },
  mergeBgcolor: {
    color: theme.colors.base,
  },
  
  // Фоновые стили
  bgPrimary: {
    backgroundColor: theme.colors.primary,
  },
  bgSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  bgTertiary: {
    backgroundColor: theme.colors.tertiary,
  },
  bgQuaternary: {
    backgroundColor: theme.colors.quaternary,
  },
  bgBase: {
    backgroundColor: theme.colors.base, 
  },
  bgDefault: {
    backgroundColor: theme.color.background.default, 
  },
  bgAppBackground: {
    backgroundColor: theme.color.appBackground,
  },
});
