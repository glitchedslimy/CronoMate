import { ThemeProvider } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "./components/atoms/Button";
import Graph from "./components/template/Graph";
import TotalHours from "./components/template/TotalHours";
import useTorokaFonts from "./hooks/useToroka";
import { useWorkEntries } from "./hooks/useWorkEntries";
import DefaultTheme from "./theme/DefaultTheme";

export default function RootLayout() {
  const [loaded, error] = useTorokaFonts();
  const insets = useSafeAreaInsets();
  const { entries, dbReady, addWorkEntries, fetchEntries } = useWorkEntries();
  useEffect(() => {
    if (dbReady) {
      fetchEntries();
    }
  }, [dbReady, fetchEntries]);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: DefaultTheme.colors.background }}
    >
      <ThemeProvider value={DefaultTheme}>
        <LinearGradient
          colors={DefaultTheme.colors.gradient}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.2, y: 0.7 }}
          style={styles.fullScreenGradient}>
          <StatusBar style="light" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingTop: insets.top, paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <TotalHours entries={entries} dbReady={dbReady} />
            <Graph entries={entries} dbReady={dbReady} fetchEntries={fetchEntries}/>
          </ScrollView>
          <Button absolute size="medium">Añadir horas</Button>
        </LinearGradient>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: { flex: 1 },
  scrollContainer: { paddingBottom: 100 },
});
