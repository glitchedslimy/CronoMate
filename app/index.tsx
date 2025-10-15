import { ThemeProvider } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ColorValue, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "./components/atoms/Button";
import CardDisplay from "./components/card-display/CardDisplay";
import ExpandableForm from "./components/form/ExpandableForm";
import Graph from "./components/graph/Graph";
import TotalHours from "./components/total-hours/TotalHours";
import {
    addWorkEntries,
    deleteEntry,
    getEntriesByMonth,
    initDB,
    WorkEntry
} from "./db/WorkerEntriesService";
import useTorokaFonts from "./hooks/useToroka";
import DefaultTheme from "./theme/DefaultTheme";

export default function RootLayout() {
  const [loaded, error] = useTorokaFonts();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [dbReady, setDbReady] = useState(false);


  useEffect(() => {
    async function init() {
      await initDB();
      setDbReady(true);
    }
    init();
  }, []);


  const fetchEntries = async (month?: number) => {
    if (!dbReady) return;
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    try {
      const data = await getEntriesByMonth(now.getFullYear(), m);
      setEntries(data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };


  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  const gradientColors: readonly [ColorValue, ColorValue, ...ColorValue[]] = [
    DefaultTheme.colors.primaryGradient,
    DefaultTheme.colors.secondary,
    DefaultTheme.colors.background,
  ];

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: DefaultTheme.colors.background }}
    >
      <ThemeProvider value={DefaultTheme}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.2, y: 0.7 }}
          style={styles.fullScreenGradient}
        >
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
            <Graph entries={entries} dbReady={dbReady} fetchEntries={fetchEntries} />
            <CardDisplay entries={entries} dbReady={dbReady} onDelete={async (id: number) => {
              if (!dbReady) return;
              try {
                await deleteEntry(id);
                await fetchEntries(); // refresh entries after deletion
              } catch (err) {
                console.error("Error deleting entry:", err);
              }
            }} />
          </ScrollView>

          <Button absolute onPress={() => setModalVisible(true)}>Añadir horas</Button>

          <ExpandableForm
            visible={modalVisible}
            setVisible={setModalVisible}
            onSubmit={async (data) => {
              if (!dbReady) return; // Ensure DB is ready
              const entry: WorkEntry = {
                date: data.selectedDate.toISOString(),
                moneyPerHour: parseFloat(data.money) || 0,
                hoursWorkedPerDay: parseFloat(data.hours) || 0,
                extraHours: data.extraHours,
                moneyPerHourExtra: parseFloat(data.extraMoney) || 0,
                hoursWorkedPerDayExtra: parseFloat(data.extraHoursValue) || 0,
              };

              try {
                await addWorkEntries([entry]);
                setModalVisible(false);
                await fetchEntries(); // refresh state immediately
              } catch (err) {
                console.error("Error adding work entry:", err);
              }
            }}
          />
        </LinearGradient>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: { flex: 1 },
  scrollContainer: { paddingBottom: 100 },
});
