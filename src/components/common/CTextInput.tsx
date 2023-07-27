import React from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native";
import { Text, VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface TextInputProps {
  name: string;
  value: string;
  onChange?: (name: string, value: string) => void | Promise<void>;
  placeholder: string;
  label?: string;
  style?: object;
  secure?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onEnd?: () => void;
}

function CTextInput({
  name,
  value,
  onChange,
  placeholder,
  label,
  style = {},
  secure = false,
  autoCapitalize = "sentences",
  autoCorrect = true,
  keyboardType = "default",
  onEnd,
}: TextInputProps) {
  const theme = useThemeOptions();

  return (
    <VStack my="$2">
      {label && (
        <Text mx="$3" pb="$1" size="sm">
          {label}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        style={[
          styles.input,
          style,
          {
            backgroundColor: theme.colors.fg,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={(v) => onChange(name, v)}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secure}
        keyboardAppearance={theme.config.initialColorMode}
        keyboardType={keyboardType}
        onEndEditing={() => onEnd && onEnd()}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: "stretch",
    // TODO change so not hardcoded white
    backgroundColor: "white",
    marginHorizontal: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default CTextInput;
