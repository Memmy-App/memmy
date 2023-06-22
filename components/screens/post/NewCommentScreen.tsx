import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  HStack,
  Icon,
  Text,
  useColorMode,
  useTheme,
  View,
  VStack,
} from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment/moment";
import { useAppSelector } from "../../../store";
import { selectNewComment } from "../../../slices/newComment/newCommentSlice";
import LoadingView from "../../ui/Loading/LoadingView";
import useNewComment from "../../hooks/newComment/newCommentHooks";
import { truncateName } from "../../../helpers/TextHelper";
import RenderMarkdown from "../../ui/markdown/RenderMarkdown";
import KeyboardAccessory from "../../ui/KeyboardAccessory";

function NewCommentScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const inputRef = useRef<TextInput>();

  const newComment = useNewComment();
  const theme = useTheme();
  const colorMode = useColorMode();

  const { responseTo } = useAppSelector(selectNewComment);

  const myVote = responseTo.post
    ? responseTo.post.my_vote
    : responseTo.comment.my_vote;

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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeft(),
      headerRight: () => headerRight(),
      title: responseTo.post ? "Replying to Post" : "Replying to Comment",
    });
  }, [newComment.content]);

  if (newComment.loading) {
    return <LoadingView />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.app.backgroundSecondary }}
      >
        <View
          flex={1}
          flexDirection="column"
          backgroundColor={theme.colors.app.backgroundSecondary}
          justifyContent="space-between"
        >
          <TextInput
            multiline
            autoCapitalize="sentences"
            style={[
              styles.input,
              { backgroundColor: theme.colors.app.backgroundTricondary },
            ]}
            numberOfLines={20}
            value={newComment.content}
            onSelectionChange={(e) => {
              setSelection(e.nativeEvent.selection);
            }}
            onChangeText={newComment.setContent}
            keyboardAppearance={colorMode.colorMode}
            inputAccessoryViewID="accessory"
            autoFocus
            ref={inputRef}
          />
          <View padding={2}>
            <Text fontWeight="bold">
              {truncateName(
                responseTo.post
                  ? responseTo.post.creator.name
                  : responseTo.comment.creator.name
              )}
            </Text>
            <HStack space={3} alignItems="center">
              <HStack space={0} alignItems="center">
                <Icon
                  as={Ionicons}
                  name={
                    myVote !== -1 ? "arrow-up-outline" : "arrow-down-outline"
                  }
                  color={
                    myVote === -1
                      ? "orange.500"
                      : myVote === 1
                      ? "green.500"
                      : "gray.500"
                  }
                />
                <Text
                  color={
                    myVote === -1
                      ? "orange.500"
                      : myVote === 1
                      ? "green.500"
                      : "gray.500"
                  }
                >
                  {(responseTo.post
                    ? responseTo.post.counts.score
                    : responseTo.comment.counts.score) + myVote}
                </Text>
              </HStack>
              <HStack space={1} alignItems="center">
                <Icon as={Ionicons} name="time-outline" />
                <Text color="gray.500">
                  {moment(
                    responseTo.post
                      ? responseTo.post.post.published
                      : responseTo.comment.comment.published
                  )
                    .utc(true)
                    .fromNow()}
                </Text>
              </HStack>
            </HStack>
            <Text>
              <VStack pr={2}>
                <RenderMarkdown
                  text={
                    responseTo.post
                      ? responseTo.post.post.body
                      : responseTo.comment.comment.content
                  }
                  addImages
                />
              </VStack>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardAccessory
        selection={selection}
        setText={newComment.setContent}
        text={newComment.content}
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
    color: "#fff",
  },
});

export default NewCommentScreen;
