import React, { SetStateAction, useState } from "react";
import { PostView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useFeedItem from "../../../../../hooks/feeds/useFeedItem";
import { ILemmyVote } from "../../../../../lemmy/types/ILemmyVote";
import { setResponseTo } from "../../../../../slices/comments/newCommentSlice";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import CompactFeedItemThumbnail from "./CompactFeedItemThumbnail";
import CompactFeedItemVote from "./CompactFeedItemVote";
import CompactFeedItemFooter from "./CompactFeedItemFooter";
import { selectSettings } from "../../../../../slices/settings/settingsSlice";

import { fontSizeMap } from "../../../../../theme/fontSize";
import { VoteOption } from "../../../../ui/SwipeableRow/VoteOption";
import { ReplyOption } from "../../../../ui/SwipeableRow/ReplyOption";
import { SwipeableRow } from "../../../../ui/SwipeableRow/SwipeableRow";

function CompactFeedItem({
  post,
  setPosts,
}: {
  post: PostView;
  setPosts?: React.Dispatch<SetStateAction<PostView[]>>;
}) {
  const {
    compactThumbnailPosition,
    compactShowVotingButtons,
    fontWeightPostTitle,
  } = useAppSelector(selectSettings);
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const feedItem = useFeedItem(post, setPosts);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onReply = () => {
    dispatch(
      setResponseTo({
        post,
        languageId: post.post.language_id,
      })
    );
    navigation.push("NewComment");
  };

  const onSwipe = (value: ILemmyVote) => {
    feedItem.onVotePress(value, false);
  };

  const { fontSize, isSystemTextSize } = useAppSelector(selectSettings);
  const { fontScale } = useWindowDimensions();
  const fontModifier = fontSizeMap[fontSize];
  const FONT_SIZE = isSystemTextSize ? 15 / fontScale : 15 + fontModifier;

  // TODO Memoize this properly
  return (
    <View flex={1} my={0.5}>
      <SwipeableRow
        leftOption={
          <VoteOption onVote={onSwipe} vote={post.my_vote} id={post.post.id} />
        }
        rightOption={<ReplyOption onReply={onReply} id={post.post.id} />}
      >
        <Pressable onPress={feedItem.onPress}>
          <HStack
            flex={1}
            px={2}
            py={1}
            backgroundColor={theme.colors.app.fg}
            space={2}
          >
            {compactThumbnailPosition === "Left" && (
              <CompactFeedItemThumbnail
                post={post}
                setImageViewOpen={setImageViewOpen}
                imageViewOpen={imageViewOpen}
                linkInfo={feedItem.linkInfo}
                setPostRead={feedItem.setPostRead}
              />
            )}

            <VStack flex={1}>
              <Text
                flex={1}
                fontSize={FONT_SIZE}
                fontWeight={fontWeightPostTitle}
                color={
                  post.read
                    ? theme.colors.app.textSecondary
                    : theme.colors.app.textPrimary
                }
              >
                {post.post.name}
              </Text>

              <CompactFeedItemFooter post={post} />
            </VStack>

            {compactThumbnailPosition === "Right" && (
              <VStack alignItems="flex-start">
                <CompactFeedItemThumbnail
                  post={post}
                  setImageViewOpen={setImageViewOpen}
                  imageViewOpen={imageViewOpen}
                  linkInfo={feedItem.linkInfo}
                  setPostRead={feedItem.setPostRead}
                />
              </VStack>
            )}

            {compactShowVotingButtons && (
              <CompactFeedItemVote
                myVote={post.my_vote as ILemmyVote}
                onVotePress={feedItem.onVotePress}
              />
            )}
          </HStack>
        </Pressable>
      </SwipeableRow>
    </View>
  );
}

export default React.memo(CompactFeedItem);
