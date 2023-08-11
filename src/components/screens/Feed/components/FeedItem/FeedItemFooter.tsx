import React from "react";
import { HStack } from "@src/components/gluestack";
import { FeedItemMetrics } from "@src/components/screens/Feed/components/FeedItem/FeedItemMetrics";
import { Actions } from "@src/components/screens/Feed/components/FeedItem/FeedItemActions";

interface IProps {
  postId: number;
}

function ItemFooter({ postId }: IProps): React.JSX.Element {
  return (
    <HStack mx="$4" alignItems="center" mb="$2">
      <FeedItemMetrics postId={postId} />
      <Actions postId={postId} />
    </HStack>
  );
}

export const FeedItemFooter = React.memo(ItemFooter);
