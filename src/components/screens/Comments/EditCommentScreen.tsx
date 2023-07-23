import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme, View } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import LoadingView from "../../common/Loading/LoadingView";
import KeyboardAccessory from "../../common/KeyboardAccessory";
import useEditComment from "../../../hooks/comments/useEditComment";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function EditCommentScreen({ route, navigation }: IProps) {
  // Hooks
  const { t } = useTranslation();
  const editComment = useEditComment(
    route.params.commentId,
    route.params.content,
    route.params.languageId
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeft(),
      headerRight: () => headerRight(),
      title: t("comment.edit"),
    });
  }, [editComment.content]);

  // State
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  // Refs
  const inputRef = useRef<TextInput>();

  // Other hooks
  const theme = useTheme();

  const headerLeft = () => (
    <Button
      title={t("Cancel")}
      onPress={() => navigation.pop()}
      color={theme.colors.app.accent}
    />
  );

  const headerRight = () => (
    <Button
      title={t("Submit")}
      onPress={() => editComment.doSubmit()}
      disabled={editComment.loading}
      color={theme.colors.app.accent}
    />
  );

  if (editComment.loading) {
    return <LoadingView />;
  }

  return (
    <>
      <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.app.bg }}>
        <View
          flex={1}
          flexDirection="column"
          backgroundColor={theme.colors.app.bg}
          justifyContent="space-between"
        >
          <TextInput
            multiline
            autoCapitalize="sentences"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.app.bg,
                color: theme.colors.app.textPrimary,
              },
            ]}
            numberOfLines={20}
            value={editComment.content}
            onSelectionChange={(e) => {
              setSelection(e.nativeEvent.selection);
            }}
            onChangeText={editComment.setContent}
            keyboardAppearance={theme.config.initialColorMode}
            inputAccessoryViewID="accessory"
            autoFocus
            ref={inputRef}
          />
        </View>
      </KeyboardAwareScrollView>
      <KeyboardAccessory
        selection={selection}
        setText={editComment.setContent}
        text={editComment.content}
        inputRef={inputRef}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: "space-around",
  },

  input: {
    alignSelf: "stretch",
    padding: 10,
    paddingTop: 15,
    height: 200,
    fontSize: 16,
  },
});

export default EditCommentScreen;
