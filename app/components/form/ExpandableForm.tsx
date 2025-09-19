import DefaultTheme from "@/app/theme/DefaultTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DaySelector from "../input/DaySelector";
import FloatInput from "../input/FloatInput";

interface Props {
  visible: boolean;
  onSubmit: (data: any) => void;
  setVisible: (enabled: boolean) => void;
}

export default function ExpandableForm({ visible, setVisible, onSubmit }: Props) {
  const [money, setMoney] = React.useState("");
  const [hours, setHours] = React.useState("");
  const [extraHours, setExtraHours] = React.useState(false);
  const [extraMoney, setExtraMoney] = React.useState("");
  const [extraHoursValue, setExtraHoursValue] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date());



  const scaleAnim = useSharedValue(0.8);
  const opacityAnim = useSharedValue(0);
  const extraAnim = useSharedValue(extraHours ? 1 : 0);

  useEffect(() => {
    if (visible) {
      scaleAnim.value = withTiming(1, { duration: 300 });
      opacityAnim.value = withTiming(1, { duration: 300 });
    } else {
      scaleAnim.value = withTiming(0.8, { duration: 300 });
      opacityAnim.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  useEffect(() => {
    extraAnim.value = withTiming(extraHours ? 1 : 0, { duration: 250 });
  }, [extraHours]);

  const animatedFormStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: opacityAnim.value,
  }));

  const animatedExtraStyle = useAnimatedStyle(() => ({
    opacity: extraAnim.value,
    maxHeight: extraAnim.value ? 200 : 0, // animate extra fields
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  }));

  if (!visible) return null;

  return (
    <KeyboardAvoidingView style={styles.wrapper}>
            <Pressable style={styles.overlay} onPress={() => setVisible(false)} />

      <Animated.View style={[styles.formContainer, animatedFormStyle]}>
      <DaySelector selectedDate={selectedDate} onChange={setSelectedDate} />
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                        <View style={{ flexDirection: "row", alignItems: "baseline", flex: 1, marginRight: 5, gap: 5 }}>
              <Ionicons name="logo-euro" size={20} color={DefaultTheme.colors.text} />
              <FloatInput
                value={money}
                onChange={setMoney}
                placeholder="17.424"
                
              />
            </View>

            <Ionicons name="close" size={20} color={DefaultTheme.colors.text} />

                        <View style={{ flexDirection: "row", alignItems: "baseline", flex: 1, marginLeft: 5, gap: 5 }}>
              <FloatInput
                value={hours}
                onChange={setHours}
                placeholder="12"
                
              />
              <Text style={styles.label}>HRS</Text>
            </View>
          </View>

                    <View style={styles.switchRow}>
            <Text style={styles.label}>¿Horas extra?</Text>
            <Switch
              value={extraHours}
              onValueChange={val => setExtraHours(val)}
              trackColor={{ false: DefaultTheme.colors.input, true: DefaultTheme.colors.primaryLight }}
              thumbColor={extraHours ? DefaultTheme.colors.primary : DefaultTheme.colors.input}
            />
          </View>

          <Animated.View style={animatedExtraStyle}>
                        <View style={{ flexDirection: "row", alignItems: "baseline", flex: 1, marginRight: 5, gap: 5 }}>
              <Ionicons name="logo-euro" size={20} color={DefaultTheme.colors.text} />
              <FloatInput
                value={extraMoney}
                onChange={setExtraMoney}
                placeholder="17.424"
                
              />
            </View>

            <Ionicons name="close" size={20} color={DefaultTheme.colors.text} />

                        <View style={{ flexDirection: "row", alignItems: "baseline", flex: 1, marginLeft: 5, gap: 5 }}>
              <FloatInput
                value={extraHoursValue}
                onChange={setExtraHoursValue}
                placeholder="12"
                
              />
              <Text style={styles.label}>HRS</Text>
            </View>
          </Animated.View>

        </View>

                <View style={{ marginTop: 20 }}>
          <Pressable
            style={styles.button}
            onPress={() =>
              onSubmit({ money, hours, extraHours, extraMoney, extraHoursValue, selectedDate })
            }
          >
            <Text style={styles.buttonText}>Añadir</Text>
          </Pressable>

          <Pressable style={{ marginTop: 10 }} onPress={() => setVisible(false)}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "90%",
    backgroundColor: DefaultTheme.colors.background,
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 15,
    elevation: 15,
  },
  label: {
    color: "#fff",
    fontFamily: "Toroka-WideBold",
    marginBottom: 8,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: DefaultTheme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Toroka-WideBold"
  },
  closeText: {
    color: "#fff",
    fontFamily: "Toroka-Bold",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
});
