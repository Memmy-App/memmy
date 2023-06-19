import React, { SetStateAction, useEffect, useState } from "react";
import { ListingType, PostView, SortType } from "lemmy-js-client";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import {
  removeDuplicatePosts,
  removeNsfwPosts,
} from "../../../lemmy/LemmyHelpers";
import { clearUpdateVote, selectFeed } from "../../../slices/feed/feedSlice";

export interface UseFeed {
  posts: PostView[] | null;
  postsLoading: boolean;
  postsError: boolean;

  sort: SortType;
  setSort: (sort: SortType) => void;

  refreshList: boolean;
  setRefreshList: React.Dispatch<SetStateAction<boolean>>;

  listingType: ListingType;
  setListingType: (listingType: ListingType) => void;

  doLoad: (refresh?: boolean) => void;
}

export const useFeed = (communityId?: number): UseFeed => {
  // Global State
  const { defaultSort, defaultListingType, hideNsfw } =
    useAppSelector(selectSettings);
  const { updateVote } = useAppSelector(selectFeed);

  // State
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<boolean>(false);

  const [sort, setSort] = useState<SortType>(defaultSort);
  const [listingType, setListingType] =
    useState<ListingType>(defaultListingType);
  const [nextPage, setNextPage] = useState(1);

  const [refreshList, setRefreshList] = useState(false);

  // Refs

  // Other Hooks
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (lemmyInstance) {
      doLoad(true).then();
    }
  }, [sort, listingType]);

  useEffect(() => {
    if (updateVote) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.post.id === updateVote.postId) {
            return {
              ...p,
              my_vote: updateVote.vote,
            };
          }

          return p;
        })
      );

      setRefreshList(!refreshList);

      dispatch(clearUpdateVote());
    }
  }, [updateVote]);

  const doLoad = async (refresh = false) => {
    setPostsLoading(true);
    setPostsError(false);

    try {
      const res = await lemmyInstance.getPosts({
        auth: lemmyAuthToken,
        community_id: communityId ?? undefined,
        limit: 20,
        page: refresh ? 1 : nextPage,
        sort,
        type_: listingType,
      });

      const newPosts = hideNsfw ? removeNsfwPosts(res.posts) : res.posts;

      if (!posts || refresh) {
        setPosts(newPosts);
        setNextPage(2);
      } else {
        // TODO Revisit this once hopeful changes are made to Lemmy. I don't like having to actually iterate through
        // all of the posts to remove duplicates, seems hacky
        setPosts((prev) => [...prev, ...removeDuplicatePosts(prev, newPosts)]);
        setNextPage((prev) => prev + 1);
      }

      setPostsLoading(false);
    } catch (e) {
      setPosts(null);
      setPostsError(false);
      setPostsError(true);
    }
  };

  return {
    posts,
    postsLoading,
    postsError,

    refreshList,
    setRefreshList,

    sort,
    setSort,

    listingType,
    setListingType,

    doLoad,
  };
};
