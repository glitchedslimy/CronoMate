import { DarkTheme } from "@react-navigation/native";
import { ColorValue } from "react-native";


const DefaultTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#02ae5eff',
    primaryGradient: '#016d3bff',
    primaryLight: '#18c876ff',
    secondary: '#012f39ff',
    background: '#0a0a0aff',
    card: 'rgb(18, 18, 18)',
    cardElevated: 'rgba(33, 33, 33, 1)',
    input: 'rgba(43, 43, 43, 1)',
    text: 'rgb(240, 240, 240)',
    textAlpha: 'rgb(240, 240, 240, 0.7)',
    border: 'rgb(30, 30, 30)',
    success: 'rgba(7, 190, 43, 1)',
    notification: 'rgba(238, 54, 45, 1)',
    error: 'rgb(255, 69, 58)',
    warning: "rgba(234, 228, 40, 1)",
    accent: "rgba(241, 147, 59, 1)",
    graph: "#18c876ff",
    graphSecondary: "#12CFF3",
    gradient: ["#02ae5eff", "#012f39ff", "#0a0a0aff"] as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]
  },
};
export default DefaultTheme;