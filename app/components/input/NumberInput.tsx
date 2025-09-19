import DefaultTheme from "@/app/theme/DefaultTheme";
import React from "react";
import { StyleSheet, TextInput } from "react-native";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function NumericInput({ value, onChange, placeholder }: Props) {
  const handleNumericInput = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    onChange(numeric);
  };

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={handleNumericInput}
      placeholder={placeholder}
      placeholderTextColor="#ffffff63"
      keyboardType="number-pad"
      selectionColor={DefaultTheme.colors.primaryLight}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ffffff63",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
  },
});
