import DefaultTheme from "@/app/theme/DefaultTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

interface TempCardProps {
  id: number;
  description: string;
  hours: string;
  date?: string;
  money?: number;
  onDelete: (id: number) => void;
}

export default function TempCard({
  id,
  description,
  hours,
  date,
  money,
  onDelete,
}: TempCardProps) {
  let formattedDate = "Sin fecha";
  if (date) {
    try {
      const [day, month, year] = date.split("/").map(Number);
      const jsDate = new Date(year, month - 1, day);
      formattedDate = jsDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      formattedDate = date;
    }
  }

  const translateX = useSharedValue(0);
  const deletionActive = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX;
        deletionActive.value = e.translationX > 100;
      }
    })
    .onEnd(() => {
      if (deletionActive.value) {
        scheduleOnRN(onDelete, id);
      }
      translateX.value = withSpring(0);
      deletionActive.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: deletionActive.value ? 1 : 0,
  }));

  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.deleteBackground}>
        <Animated.View style={deleteButtonStyle}>
          <Pressable onPress={() => (translateX.value = withSpring(0))}>
            <Ionicons name="trash" size={30} color="white" />
          </Pressable>
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={30} color={DefaultTheme.colors.text} />
            </View>
            <View>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "column", justifyContent: "center", paddingRight: 10 }}>
            <Text style={styles.hoursText}>{hours} Horas</Text>
            {money !== undefined && (
              <Text style={styles.moneyText}>€{money.toFixed(2)}</Text>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DefaultTheme.colors.card,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
  },
  deleteBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 120,
    borderRadius: 10,
    backgroundColor: DefaultTheme.colors.notification,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  iconContainer: {
    backgroundColor: DefaultTheme.colors.cardElevated,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  dateText: {
    color: DefaultTheme.colors.text,
    fontFamily: "Toroka-Medium",
    fontSize: 18,
  },
  descriptionText: {
    fontFamily: "Toroka-Regular",
    fontSize: 13,
    marginLeft: 2,
    color: DefaultTheme.colors.textAlpha,
  },
  hoursText: {
    color: DefaultTheme.colors.text,
    fontFamily: "Toroka-Medium",
    fontSize: 18,
  },
  moneyText: {
    color: DefaultTheme.colors.textAlpha,
    fontFamily: "Toroka-Medium",
    fontSize: 12,
  },
});
