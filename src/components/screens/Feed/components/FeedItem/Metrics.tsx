import { HStack } from "@src/components/common/Gluestack";
import React from "react";
import {
  useFeedPostCounts,
  useFeedPostUnreadComments,
  useFeedPostVote,
} from "@src/stores/feeds/feedsStore";
import { useRoute } from "@react-navigation/core";
import VoteData from "../../../../common/Vote/VoteData";
import CommentCount from "../../../../common/Comments/CommentCount";
import DatePublished from "../../../../common/DatePublished";

interface Props {
  postId: number;
}

function metrics({ postId }: Props) {
  const { key } = useRoute();
  const postVote = useFeedPostVote(key, postId);
  const postCounts = useFeedPostCounts(key, postId);
  const postUnreadComments = useFeedPostUnreadComments(key, postId);

  return (
    <HStack flex={1} space="sm">
      <VoteData data={postCounts} myVote={postVote} />
      <CommentCount
        commentCount={postCounts.comments}
        newComments={postUnreadComments}
      />
      <DatePublished published={postCounts.published} />
    </HStack>
  );
}

export const Metrics = React.memo(metrics);
