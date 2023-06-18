import React from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useColorMode, useTheme } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../../store";
import { selectNewComment } from "../../../slices/newComment/newCommentSlice";
import LoadingView from "../../ui/Loading/LoadingView";
import useNewComment from "../../hooks/newComment/newCommentHooks";

function NewCommentScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const newComment = useNewComment();
  const theme = useTheme();
  const colorMode = useColorMode();

  const { responseTo } = useAppSelector(selectNewComment);

  const headerLeft = () => (
    <Button title="Cancel" onPress={() => navigation.pop()} />
  );

  const headerRight = () => (
    <Button
      title="Submit"
      onPress={newComment.doSubmit}
      disabled={newComment.loading}
    />
  );

  navigation.setOptions({
    headerLeft,
    headerRight,
    title: responseTo.post ? "Replying to Post" : "Replying to Comment",
  });

  if (newComment.loading) {
    return <LoadingView />;
  }

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.screen[800] }}
    >
      <TextInput
        multiline
        autoCapitalize="sentences"
        style={[styles.input, { backgroundColor: theme.colors.screen["700"] }]}
        numberOfLines={20}
        value={newComment.content}
        onChangeText={newComment.setContent}
        keyboardAppearance={colorMode.colorMode}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: "stretch",
    padding: 10,
    paddingTop: 15,
    height: 300,
    fontSize: 16,
    color: "#fff",
  },
});

export default NewCommentScreen;
