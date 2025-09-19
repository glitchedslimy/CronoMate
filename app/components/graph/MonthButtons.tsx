import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { getDb } from "../../db/WorkerEntriesService";
import { convertMonth } from "./ConvertMonth";

interface MonthButtonsProps {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  entries: any[]; // <-- pass entries so we refetch when they change
}

export default function MonthButtons({ selectedMonth, setSelectedMonth, entries }: MonthButtonsProps) {
  const [months, setMonths] = useState<{ month: number }[]>([]);

  useEffect(() => {
    async function fetchMonths() {
      try {
        const db = getDb();
        const stmt = await db.prepareAsync(`
          SELECT DISTINCT CAST(strftime('%m', date) AS INTEGER) AS month
          FROM WorkEntries
          ORDER BY month ASC
        `);

        try {
          const result = await stmt.executeAsync();
          const rows = await result.getAllAsync();
          const monthsData = rows.map((row: any) => ({ month: row.month }));
          setMonths(monthsData);

          if (!monthsData.find(m => m.month === selectedMonth) && monthsData.length > 0) {
            setSelectedMonth(monthsData[monthsData.length - 1].month);
          }
        } finally {
          await stmt.finalizeAsync();
        }
      } catch (err) {
        console.error("Error fetching months:", err);
      }
    }

    fetchMonths();
  }, [entries]);

  if (months.length === 0) return null;

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
    >
      {months.map(({ month }) => {
        const isActive = month === selectedMonth;
        return (
          <TouchableOpacity
            key={month}
            onPress={() => setSelectedMonth(month)}
            style={[styles.button, isActive && styles.activeButton]}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {convertMonth(month)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, alignItems: "center" },
  button: { marginRight: 8, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6, backgroundColor: "transparent", height: 30, alignSelf: "flex-start" },
  activeButton: { backgroundColor: "#444" },
  text: { color: "#888", fontSize: 16 },
  activeText: { color: "#fff", fontWeight: "bold" },
});
