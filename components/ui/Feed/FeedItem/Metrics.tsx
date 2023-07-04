import { PostAggregates } from "lemmy-js-client";
import { HStack } from "native-base";
import React from "react";
import CommentCount from "../../common/CommentCount";
import DatePublished from "../../common/DatePublished";
import VoteData from "../../common/VoteData";

interface Props {
  data: PostAggregates;
  vote?: number;
}

export function Metrics({ data, vote }: Props) {
  return (
    <HStack flex={1} space={2}>
      <VoteData data={data} vote={vote} />
      <CommentCount commentCount={data.comments} />
      <DatePublished published={data.published} />
    </HStack>
  );
}
