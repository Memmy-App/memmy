import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HStack, Icon, Text, View, VStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { selectNewComment } from "../../../slices/comments/newCommentSlice";
import LoadingView from "../../common/Loading/LoadingView";
import useNewComment from "../../../hooks/comments/useNewComment";
import { truncateName } from "../../../helpers/TextHelper";
import RenderMarkdown from "../../common/Markdown/RenderMarkdown";
import KeyboardAccessory from "../../common/KeyboardAccessory";
import SmallVoteIcons from "../../common/Vote/SmallVoteIcons";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import { getBaseUrl } from "../../../helpers/LinkHelper";

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
  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);

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
      title: responseTo.post
        ? t("comment.replyingToPost")
        : t("comment.replyingToComment"),
    });
  }, [newComment.content]);

  const headerLeft = () => (
    <Button
      title={t("Cancel")}
      onPress={() => navigation.pop()}
      color={theme.colors.accent}
    />
  );

  const headerRight = () => (
    <Button
      title={t("Submit")}
      onPress={newComment.doSubmit}
      disabled={newComment.loading}
      color={theme.colors.accent}
    />
  );

  if (newComment.loading) {
    return <LoadingView />;
  }

  return (
    <>
      <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.bg }}>
        <View
          flex={1}
          flexDirection="column"
          backgroundColor={theme.colors.bg}
          justifyContent="space-between"
        >
          <TextInput
            multiline
            autoCapitalize="sentences"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.bg,
                color: theme.colors.textPrimary,
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
            <HStack space="md" alignItems="center">
              <HStack space="xxxs" alignItems="center">
                <SmallVoteIcons
                  upvotes={upvotes}
                  downvotes={downvotes}
                  myVote={myVote as ILemmyVote}
                />
              </HStack>
              <HStack space="xs" alignItems="center">
                <Icon as={Ionicons} name="time-outline" />
                <Text color={theme.colors.textSecondary}>
                  {dayjs(
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
              <VStack pr="$2">
                <RenderMarkdown
                  text={
                    responseTo.post
                      ? responseTo.post.post.body
                      : responseTo.comment.comment.content
                  }
                  instance={getBaseUrl(
                    responseTo.post
                      ? responseTo.post.post.ap_id
                      : responseTo.comment.comment.ap_id
                  )}
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
