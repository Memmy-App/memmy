import React, { useCallback, useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "native-base";
import { Button, Dimensions, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useKeyboard } from "@react-native-community/hooks";
import KeyboardAccessory from "../../common/KeyboardAccessory";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function NewPostBodyScreen({ route, navigation }: IProps) {
  const theme = useTheme();
  const { keyboardHeight } = useKeyboard();

  const [body, setBody] = useState(route.params.body ?? "");
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const textInput = useRef<TextInput>();

  const HeaderLeftButton = useCallback(
    () => (
      <Button title="Done" color={theme.colors.app.accent} onPress={goBack} />
    ),
    [body]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderLeftButton,
    });
  }, [body]);

  const goBack = () => {
    navigation.navigate("NewPost", { ...route.params, body });
  };

  return (
    <>
      <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.app.bg }}>
        <TextInput
          multiline
          placeholder="Type away!"
          placeholderTextColor={theme.colors.app.textSecondary}
          autoCapitalize="sentences"
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.app.bg,
              color: theme.colors.app.textPrimary,
              height: Dimensions.get("window").height - keyboardHeight - 120,
            },
          ]}
          numberOfLines={20}
          value={body}
          onSelectionChange={(e) => {
            setSelection(e.nativeEvent.selection);
          }}
          onChangeText={setBody}
          keyboardAppearance={theme.config.initialColorMode}
          inputAccessoryViewID="accessory"
          ref={textInput}
          autoFocus
        />
      </KeyboardAwareScrollView>
      <KeyboardAccessory
        setText={setBody}
        text={body}
        selection={selection}
        inputRef={textInput}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: "stretch",
    padding: 10,
    paddingTop: 15,
    fontSize: 16,
  },
});

export default NewPostBodyScreen;
