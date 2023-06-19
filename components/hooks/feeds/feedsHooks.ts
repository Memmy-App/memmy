import React, { SetStateAction, useEffect, useRef, useState } from "react";
import {
  CommunityView,
  ListingType,
  PostView,
  SortType,
} from "lemmy-js-client";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import {
  isSubscribed,
  removeDuplicatePosts,
  removeNsfwPosts,
} from "../../../lemmy/LemmyHelpers";
import { clearUpdateVote, selectFeed } from "../../../slices/feed/feedSlice";
import CommunityLink from "../../ui/CommunityLink";
import { selectCommunities } from "../../../slices/communities/communitiesSlice";

export interface UseFeed {
  posts: PostView[] | null;
  postsLoading: boolean;
  postsError: boolean;

  community: CommunityView | null;
  communityLoading: boolean;
  communityError: boolean;

  sort: SortType;
  setSort: (sort: SortType) => void;

  subscribed: boolean;
  setSubscribed: React.Dispatch<SetStateAction<boolean>>;

  refreshList: boolean;
  setRefreshList: React.Dispatch<SetStateAction<boolean>>;

  listingType: ListingType;
  setListingType: (listingType: ListingType) => void;

  doLoad: (refresh?: boolean) => void;

  loaded: boolean;
  setLoaded: React.Dispatch<SetStateAction<any>>;
}

export const useFeed = (communityIdOrName?: number | string): UseFeed => {
  // Global State
  const { defaultSort, defaultListingType, hideNsfw } =
    useAppSelector(selectSettings);
  const { updateVote } = useAppSelector(selectFeed);
  const { subscribedCommunities } = useAppSelector(selectCommunities);

  // State
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<boolean>(false);

  const [community, setCommunity] = useState<CommunityView | null>(null);
  const [communityLoading, setCommunityLoading] = useState<boolean>(false);
  const [communityError, setCommunityError] = useState<boolean>(false);

  const [subscribed, setSubscribed] = useState<boolean>(false);

  const [sort, setSort] = useState<SortType>(defaultSort);
  const [listingType, setListingType] =
    useState<ListingType>(defaultListingType);
  const [nextPage, setNextPage] = useState(1);

  const [refreshList, setRefreshList] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Refs

  // Other Hooks
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loaded) return;

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
    const loadCommunity = async () => {
      setCommunityLoading(true);
      setCommunityError(false);

      try {
        const res = await lemmyInstance.getCommunity({
          auth: lemmyAuthToken,
          id:
            typeof communityIdOrName === "number"
              ? (communityIdOrName as number)
              : undefined,
          name:
            typeof communityIdOrName === "string"
              ? (communityIdOrName as string)
              : undefined,
        });

        setCommunity(res.community_view);
        setCommunityLoading(false);
        setSubscribed(
          isSubscribed(res.community_view.community.id, subscribedCommunities)
        );
      } catch (e) {
        setCommunityLoading(false);
        setCommunityError(true);
      }
    };

    const loadPosts = async () => {
      setPostsLoading(true);
      setPostsError(false);

      try {
        const res = await lemmyInstance.getPosts({
          auth: lemmyAuthToken,
          community_id:
            typeof communityIdOrName === "number"
              ? (communityIdOrName as number)
              : undefined,
          community_name:
            typeof communityIdOrName === "string"
              ? (communityIdOrName as string)
              : undefined,
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
          setPosts((prev) => [
            ...prev,
            ...removeDuplicatePosts(prev, newPosts),
          ]);
          setNextPage((prev) => prev + 1);
        }

        setPostsLoading(false);
      } catch (e) {
        setPosts(null);
        setPostsError(false);
        setPostsError(true);
      }
    };

    if (communityIdOrName && (refresh || !community)) loadCommunity().then();
    loadPosts().then();
  };

  return {
    posts,
    postsLoading,
    postsError,

    community,
    communityLoading,
    communityError,

    refreshList,
    setRefreshList,

    subscribed,
    setSubscribed,

    sort,
    setSort,

    listingType,
    setListingType,

    doLoad,

    loaded,
    setLoaded,
  };
};
