import { PostAggregates } from "lemmy-js-client";
import { HStack } from "@src/components/common/Gluestack";
import React from "react";
import CommentCount from "../../../../common/Comments/CommentCount";
import DatePublished from "../../../../common/DatePublished";
import VoteData from "../../../../common/Vote/VoteData";

interface Props {
  data: PostAggregates;
  vote?: number;
  newComments: number;
}

function metrics({ data, vote, newComments }: Props) {
  return (
    <HStack flex={1} space="sm">
      <VoteData data={data} vote={vote} />
      <CommentCount commentCount={data.comments} newComments={newComments} />
      <DatePublished published={data.published} />
    </HStack>
  );
}

export const Metrics = React.memo(metrics);
