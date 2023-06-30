import React, { useCallback } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Text, useTheme, VStack } from "native-base";

interface TextInputProps {
  name: string;
  value: string;
  onChange?: (name: string, value: string) => void | Promise<void>;
  placeholder: string;
  label: string;
  style?: object;
  secure?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoFocus?: boolean;
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
  autoFocus = false,
}: TextInputProps) {
  let focused = false;

  const theme = useTheme();

  const ref = useCallback((node) => {
    if (!node) return;

    if (autoFocus && !focused) {
      focused = true;
      node.focus();
    }
  }, []);

  return (
    <VStack my={2}>
      <Text mx={3} pb={1} fontSize={13}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        style={[
          styles.input,
          style,
          {
            backgroundColor: theme.colors.app.fg,
            borderColor: theme.colors.app.border,
            color: theme.colors.app.textPrimary,
          },
        ]}
        placeholderTextColor={theme.colors.app.textSecondary}
        value={value}
        onChangeText={(v) => onChange(name, v)}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secure}
        ref={autoFocus ? ref : null}
        keyboardAppearance={theme.config.initialColorMode}
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
