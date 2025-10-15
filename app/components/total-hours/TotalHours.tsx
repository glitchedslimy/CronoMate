import DefaultTheme from "@/app/theme/DefaultTheme";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from "react";
import { Text, View } from "react-native";
import { Badge } from "../badge/Badge";
import TotalMoney from "../organisms/TotalMoney";

interface WorkEntry {
  date: string;
  extraHours: boolean;
  hoursWorkedPerDay: number;
  hoursWorkedPerDayExtra: number;
  moneyPerHour: number;
  moneyPerHourExtra: number;
  id: number;
}

interface TotalHoursProps {
  entries: WorkEntry[];
  dbReady: boolean;
}

export default function TotalHours({ entries, dbReady }: TotalHoursProps) {
  const { monthlyHours, weeklyHours, todayHours, monthlyMoney } = useMemo(() => {
    if (!dbReady || !entries || entries.length === 0) {
      return { monthlyHours: 0, weeklyHours: 0, todayHours: 0, monthlyMoney: 0 };
    }

    // Find the latest entry to determine the month/year
    const latestEntryDate = new Date(Math.max(...entries.map(e => new Date(e.date).getTime())));
    const targetMonth = latestEntryDate.getMonth();
    const targetYear = latestEntryDate.getFullYear();

    // Filter entries for that month/year
    const monthEntries = entries.filter(entry => {
      const d = new Date(entry.date);
      return d.getFullYear() === targetYear && d.getMonth() === targetMonth;
    });

    let monthlyHours = 0;
    let monthlyMoney = 0;
    let weeklyHours = 0;
    let todayHours = 0;

    const dailyMap: { [day: number]: number } = {};

    monthEntries.forEach(entry => {
      const d = new Date(entry.date);
      const day = d.getDate();
      const hours = entry.hoursWorkedPerDay + (entry.hoursWorkedPerDayExtra ?? 0);
      const money = entry.hoursWorkedPerDay * entry.moneyPerHour +
                    (entry.hoursWorkedPerDayExtra ?? 0) * (entry.moneyPerHourExtra ?? 0);

      monthlyHours += hours;
      monthlyMoney += money;

      dailyMap[day] = (dailyMap[day] || 0) + hours;
    });

    // Weekly hours based on the week of the latest entry
    const dayOfWeek = latestEntryDate.getDay(); // 0 = Sunday
    const today = latestEntryDate.getDate();
    const firstDayOfWeek = today - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

    for (let i = firstDayOfWeek; i <= today; i++) {
      weeklyHours += dailyMap[i] || 0;
    }

    todayHours = dailyMap[today] || 0;

    return { monthlyHours, weeklyHours, todayHours, monthlyMoney };
  }, [entries, dbReady]);

  if (!dbReady) return null;

  return (
    <View style={{ marginLeft: 20, marginRight: 20, marginTop: 60 }}>
      <Text style={{ color: DefaultTheme.colors.text, fontSize: 20, fontFamily: "Toroka-Regular" }}>
        Horas trabajadas
      </Text>

      <View style={{ alignItems: "center", flexDirection: "row", gap: 2 }}>
        <Text style={{ marginTop: 1 }}>
          <Ionicons name="hourglass" size={31} color="white" />
        </Text>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
          <Text style={{ color: DefaultTheme.colors.text, fontSize: 40, fontFamily: "Toroka-WideBold", marginTop: -9 }}>
            {monthlyHours}
          </Text>
          <Badge size="lg">HRS</Badge>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", marginTop: 50 }}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={15} color={DefaultTheme.colors.graph} />
            <Text style={{ color: DefaultTheme.colors.text, fontSize: 14, fontFamily: "Toroka" }}>
              {weeklyHours} Semanales
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Ionicons name="today-outline" size={15} color={DefaultTheme.colors.graphSecondary} />
            <Text style={{ color: DefaultTheme.colors.text, fontSize: 14, fontFamily: "Toroka" }}>
              {todayHours} Día
            </Text>
          </View>
        </View>

        <TotalMoney amount={monthlyMoney} />
      </View>
    </View>
  );
}
