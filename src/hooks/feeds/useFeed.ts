import React, { SetStateAction, useEffect, useState } from "react";
import {
  CommunityView,
  ListingType,
  PostView,
  SortType,
} from "lemmy-js-client";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import {
  removeDuplicatePosts,
  removeNsfwPosts,
  removeReadPosts,
} from "../../helpers/LemmyHelpers";
import { clearUpdateSaved } from "../../slices/feed/feedSlice";
import { preloadImages } from "../../helpers/ImageHelper";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { useSaved, useVoted } from "../../stores/updates/updatesStore";

export interface UseFeed {
  posts: PostView[] | null;
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;
  postsLoading: boolean;
  postsError: boolean;

  community: CommunityView | null;
  setCommunity: React.Dispatch<SetStateAction<CommunityView>>;
  communityLoading: boolean;
  communityError: boolean;
  communityNotFound: boolean;

  sort: SortType;
  setSort: (sort: SortType) => void;

  refreshList: boolean;
  setRefreshList: React.Dispatch<SetStateAction<boolean>>;

  listingType: ListingType;
  setListingType: (listingType: ListingType) => void;

  doLoad: (refresh?: boolean) => void;

  loaded: boolean;
  setLoaded: React.Dispatch<SetStateAction<any>>;
}

export const useFeed = (
  communityIdOrName?: number | string,
  isCommunity = false
): UseFeed => {
  // Global State
  const {
    defaultSort,
    defaultListingType,
    hideNsfw,
    hideReadPostsOnFeed,
    hideReadPostsInCommunities,
  } = useAppSelector(selectSettings);

  const updateVote = useVoted();
  const updateSaved = useSaved();

  // State
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<boolean>(false);

  const [community, setCommunity] = useState<CommunityView | null>(null);
  const [communityLoading, setCommunityLoading] = useState<boolean>(false);
  const [communityError, setCommunityError] = useState<boolean>(false);
  const [communityNotFound, setCommunityNotFound] = useState<boolean>(false);

  const [sort, setSort] = useState<SortType>(defaultSort);
  const [listingType, setListingType] =
    useState<ListingType>(defaultListingType);
  const [nextPage, setNextPage] = useState(1);

  const [refreshList, setRefreshList] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Hooks
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (updateVote) {
      if (!posts) return;

      setPosts((prev) => {
        if (!prev) return null;

        return prev.map((p) => {
          if (p.post.id === updateVote.postId) {
            return {
              ...p,
              my_vote: updateVote.value,
            };
          }

          return p;
        });
      });
    }
  }, [updateVote]);

  useEffect(() => {
    if (updateSaved) {
      if (!posts) return;

      setPosts((prev) => {
        if (!prev) return null;

        return prev.map((p) => {
          if (p.post.id === updateSaved.postId) {
            return {
              ...p,
              saved: updateSaved.saved,
            };
          }

          return p;
        });
      });

      dispatch(clearUpdateSaved());
    }
  }, [updateSaved]);

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
      } catch (e) {
        setCommunityLoading(false);
        setCommunityError(true);

        if (e.toString() === "couldnt_find_community") {
          setCommunityNotFound(true);
        }

        handleLemmyError(e.toString());
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

        if (!res.posts || res.posts.length === 0) {
          setPostsLoading(false);
          return;
        }

        // Filter posts
        let newPosts = hideNsfw ? removeNsfwPosts(res.posts) : res.posts;

        if (
          (hideReadPostsOnFeed && !isCommunity) ||
          (hideReadPostsInCommunities && isCommunity)
        ) {
          newPosts = removeReadPosts(res.posts);
        }

        preloadImages(newPosts);

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
        setPostsLoading(false);
        setPostsError(true);

        handleLemmyError(e.toString());
      }
    };

    if (communityIdOrName && (refresh || !community)) loadCommunity().then();
    loadPosts().then();
  };

  return {
    posts,
    setPosts,

    postsLoading,
    postsError,

    community,
    setCommunity,

    communityLoading,
    communityError,
    communityNotFound,

    refreshList,
    setRefreshList,

    sort,
    setSort,

    listingType,
    setListingType,

    doLoad,

    loaded,
    setLoaded,
  };
};
