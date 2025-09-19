import CronoMateTheme from "@/app/theme/DefaultTheme";
import { TextSizes } from "@/app/theme/text";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

interface ButtonProps {
  onPress?: () => void;
  size?: "small" | "medium" | "large";
  absolute?: boolean;
  children: React.ReactNode;
}

export default function Button({
  onPress,
  children,
  size = "medium",
  absolute = false,
}: ButtonProps) {
  /**
   * Map size to padding and borderRadius
   */
  const sizeStyles: Record<string, ViewStyle> = {
    small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    medium: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
    large: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 12 },
  };

  /**
   * Map size to fontSize
   */
  const textSizeMap: Record<string, number> = {
    small: TextSizes.small,
    medium: TextSizes.medium,
    large: TextSizes.large,
  };

  /**
   * Absolute positioning
   */
  const absoluteStyles: ViewStyle = absolute
    ? { position: "absolute", bottom: 20, left: 20, right: 20 }
    : {};

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles.button,
        sizeStyles[size],
        absoluteStyles,
        pressed && buttonStyles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          buttonStyles.buttonText,
          { fontSize: textSizeMap[size], textAlign: "center" },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: CronoMateTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Toroka-WideBold",
    color: CronoMateTheme.colors.text,
  },
  buttonPressed: {
    backgroundColor: CronoMateTheme.colors.primaryLight,
  },
});
