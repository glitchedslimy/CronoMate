import { Circle, Group, Path, PathOp, Skia, Text } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { convertMonth } from "./ConvertMonth";

export default function ToolTip({ x, y, color, value, label, font, subFont, selectedMonth }: any) {
  const BOX_WIDTH = 110;
  const BOX_HEIGHT = 50;
  const GAP = 2;
  const CIRCLE_R = 10;
  const RADIUS = 6;

  if (!font || !subFont) return null;

  const valueText = useDerivedValue(() => `${value.value.toFixed(2)}`, [value]);
  const labelText = useDerivedValue(() => {
    const day = Math.round(label.value);
    const month = convertMonth(selectedMonth);
    return `${day} ${month}, 2025`
  }, [label, selectedMonth]);

  const rectPath = useDerivedValue(() => {
  const rrect = Skia.RRectXY(
    {
      x: x.value + CIRCLE_R + GAP - 10,
      y: y.value - BOX_HEIGHT - GAP,
      width: BOX_WIDTH,
      height: BOX_HEIGHT
    },
    RADIUS,
    RADIUS
  );

  const path = Skia.Path.Make();
  path.addRRect(rrect);

  const circle = Skia.Path.Make();
  circle.addCircle(x.value, y.value, CIRCLE_R);

  path.op(circle, PathOp.Difference);

  return path;
}, [x, y]);

  return (
    <Group>
            <Path path={rectPath} color="white" />

            <Circle cx={x} cy={y} r={6} color={color} />

            <Text
        x={x}
        y={y}
        text={valueText}
        font={font}
        color="black"
        transform={[
          { translateX: CIRCLE_R + GAP + 12 },
          { translateY: -(BOX_HEIGHT - 18) },
        ]}
      />

            <Text
        x={x}
        y={y}
        text={labelText}
        font={subFont}
        color="gray"
        transform={[
          { translateX: CIRCLE_R + GAP + 12 },
          { translateY: -(BOX_HEIGHT - 36) },
        ]}
      />
    </Group>
  );
}