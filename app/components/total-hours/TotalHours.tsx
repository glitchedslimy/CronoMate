import DefaultTheme from "@/app/theme/DefaultTheme";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
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
  const [currentMonthEntries, setCurrentMonthEntries] = useState<WorkEntry[]>([]);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  const [monthlyMoney, setMonthlyMoney] = useState(0);


  useEffect(() => {
    if (!dbReady || !entries) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    setCurrentMonthEntries(monthEntries);
  }, [dbReady, entries]);


  useEffect(() => {

    const now = new Date();
    const today = now.getDate();
    const dailyMap: { [day: number]: number } = {};

    let totalHours = 0;
    let totalMoney = 0;

    currentMonthEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const day = entryDate.getDate();

      const hours = entry.hoursWorkedPerDay + (entry.hoursWorkedPerDayExtra ?? 0);
      const money =
        entry.hoursWorkedPerDay * entry.moneyPerHour +
        (entry.hoursWorkedPerDayExtra ?? 0) * (entry.moneyPerHourExtra ?? 0);

      totalHours += hours;
      totalMoney += money;

      dailyMap[day] = (dailyMap[day] || 0) + hours;
    });

    setMonthlyHours(totalHours);
    setMonthlyMoney(totalMoney);


    const dayOfWeek = now.getDay(); // 0 = Sunday
    const firstDayOfWeek = today - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    let weekTotal = 0;
    for (let i = firstDayOfWeek; i <= today; i++) {
      weekTotal += dailyMap[i] || 0;
    }
    setWeeklyHours(weekTotal);


    setTodayHours(dailyMap[today] || 0);

  }, [currentMonthEntries]);

  return (
    <View style={{ marginLeft: 20, marginRight: 20, marginTop: 60 }}>
      <Text style={{ color: DefaultTheme.colors.text, fontSize: 20, fontFamily: "Toroka-Regular" }}>
        Este mes tienes
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
