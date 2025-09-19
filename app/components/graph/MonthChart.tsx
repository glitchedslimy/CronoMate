import DefaultTheme from "@/app/theme/DefaultTheme";
import { useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, useChartPressState, useChartTransformState } from "victory-native";
import Toroka from '../../assets/fonts/Toroka-Regular.otf';
import TorokaWideBold from '../../assets/fonts/Toroka-WideBold.otf';
import { WorkEntry } from "../../db/WorkerEntriesService";
import LineGraph from "./LineGraph";
import ToolTip from "./Tooltip";

interface MonthChartProps {
  entries: WorkEntry[];
  selectedMonth: number;
}

export default function MonthChart({ entries, selectedMonth }: MonthChartProps) {
  const font = useFont(TorokaWideBold, 12);
  const subFont = useFont(Toroka, 12);

  const { state, isActive } = useChartPressState({ x: 0, y: { y: 0 } });
  const { state: transformState } = useChartTransformState({ scaleY: 1 });


  const dailyHours = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const dayEntries = entries.filter(e => new Date(e.date).getDate() === day);
    return dayEntries.reduce((sum, e) => sum + e.hoursWorkedPerDay + (e.hoursWorkedPerDayExtra || 0), 0);
  });

  const points = dailyHours.map((h, i) => ({ x: i + 1, y: h }));

  const activeX = state.x?.position;
  const activeY = state.y?.y?.position;
  const activeValue = state.y?.y?.value;

  return (
    <View style={{ height: 300, paddingVertical: 30 }}>
      <CartesianChart
        data={points}
        xKey="x"
        yKeys={["y"]}
        chartPressState={state}
        transformState={transformState}
        domainPadding={{ top: 60, bottom: 20 }}
        transformConfig={{ pan: { dimensions: ["x"] }, pinch: { enabled: false } }}
      >
        {({ points }) => (
          <>
            <LineGraph points={points.y} />
            {isActive && font && subFont && activeX !== undefined && activeY !== undefined && activeValue !== undefined && (
              <ToolTip
                x={activeX}
                y={activeY}
                color={DefaultTheme.colors.graph}
                value={activeValue}
                font={font}
                subFont={subFont}
                label={state.x.value}
                selectedMonth={selectedMonth}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
