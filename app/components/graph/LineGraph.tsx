import DefaultTheme from "@/app/theme/DefaultTheme";
import { Path } from "@shopify/react-native-skia";
import { PointsArray, useAnimatedPath, useLinePath } from "victory-native";

export default function LineGraph({ points }: { points: PointsArray }) {
  const { path } = useLinePath(points, { curveType: "bumpX" });
  const animPath = useAnimatedPath(path, {
    type: 'spring',
    duration: 100
  });
  return <Path path={animPath} style="stroke" strokeWidth={3} color={DefaultTheme.colors.graph} />;
}
