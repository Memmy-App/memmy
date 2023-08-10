import React, { useCallback } from "react";
import { useRoute } from "@react-navigation/core";
import { useFeedPostVote } from "@src/state/feed/feedStore";
import ILemmyVote from "@src/types/api/ILemmyVote";

interface IProps {
  postId: number;
  recycled: React.MutableRefObject<{}>;
}

function Item({ postId, recycled }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const onSwipe = useCallback((value: ILemmyVote) => {});
}

export const FeedItem = React.memo(Item);
