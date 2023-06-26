import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HStack, Icon, Text, useTheme, View, VStack } from "native-base";
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
import SmallVoteIcons from "../../ui/common/SmallVoteIcons";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";

function NewCommentScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  // Global state
  const { responseTo } = useAppSelector(selectNewComment);

  // State
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  // Refs
  const inputRef = useRef<TextInput>();

  // Hooks
  const newComment = useNewComment();

  // Other hooks
  const theme = useTheme();

  // Other
  const myVote = responseTo.post
    ? responseTo.post.my_vote
    : responseTo.comment.my_vote;

  const upvotes = responseTo.post
    ? responseTo.post.counts.upvotes
    : responseTo.comment.counts.upvotes;
  const downvotes = responseTo.post
    ? responseTo.post.counts.downvotes
    : responseTo.comment.counts.downvotes;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeft(),
      headerRight: () => headerRight(),
      title: responseTo.post ? "Replying to Post" : "Replying to Comment",
    });
  }, [newComment.content]);

  const headerLeft = () => (
    <Button
      title="Cancel"
      onPress={() => navigation.pop()}
      color={theme.colors.app.accent}
    />
  );

  const headerRight = () => (
    <Button
      title="Submit"
      onPress={newComment.doSubmit}
      disabled={newComment.loading}
      color={theme.colors.app.accent}
    />
  );

  if (newComment.loading) {
    return <LoadingView />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.app.bgSecondary }}
      >
        <View
          flex={1}
          flexDirection="column"
          backgroundColor={theme.colors.app.bgSecondary}
          justifyContent="space-between"
        >
          <TextInput
            multiline
            autoCapitalize="sentences"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.app.bgTertiary,
                color: theme.colors.app.textPrimary,
              },
            ]}
            numberOfLines={20}
            value={newComment.content}
            onSelectionChange={(e) => {
              setSelection(e.nativeEvent.selection);
            }}
            onChangeText={newComment.setContent}
            keyboardAppearance={theme.config.initialColorMode}
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
                <SmallVoteIcons
                  upvotes={upvotes}
                  downvotes={downvotes}
                  myVote={myVote as ILemmyVote}
                  initialVote={0}
                />
              </HStack>
              <HStack space={1} alignItems="center">
                <Icon as={Ionicons} name="time-outline" />
                <Text color={theme.colors.app.textSecondary}>
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
  },
});

export default NewCommentScreen;
