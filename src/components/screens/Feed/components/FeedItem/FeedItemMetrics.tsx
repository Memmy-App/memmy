import React from "react";
import { useRoute } from "@react-navigation/core";
import {
  useFeedPostCounts,
  useFeedPostRead,
  useFeedPostUnreadComments,
  useFeedPostVote,
} from "@src/state/feed/feedStore";
import { HStack } from "@src/components/gluestack";
import DatePublished from "@src/components/common/Post/DatePublished";
import CommentCount from "@src/components/common/Post/CommentCount";
import VoteData from "@src/components/common/Post/VoteData";

interface IProps {
  postId: number;
}

function ItemMetrics({ postId }: IProps): React.JSX.Element {
  const { key } = useRoute();
  const postVote = useFeedPostVote(key, postId);
  const postCounts = useFeedPostCounts(key, postId);
  const postUnreadComments = useFeedPostUnreadComments(key, postId);

  return (
    <HStack flex={1} space="sm">
      <VoteData data={postCounts!} myVote={postVote} />
      <CommentCount
        commentCount={postCounts!.comments}
        newComments={postUnreadComments}
      />
      <DatePublished published={postCounts!.published} />
    </HStack>
  );
}

export const FeedItemMetrics = React.memo(ItemMetrics);
