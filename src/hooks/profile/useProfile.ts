import { useRoute } from "@react-navigation/core";
import { PersonView } from "lemmy-js-client";
import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { buildComments } from "../../helpers/LemmyHelpers";
import { useCurrentAccount } from "../../stores/account/accountStore";
import addFeed from "../../stores/feeds/actions/addFeed";
import removeFeed from "../../stores/feeds/actions/removeFeed";
import setFeedPosts from "../../stores/feeds/actions/setFeedPosts";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

export interface UseProfile {
  doLoad: (refresh?: boolean) => Promise<void>;

  loading: boolean;
  error: boolean;
  refreshing: boolean;
  notFound: boolean;

  profile: PersonView;

  comments: ILemmyComment[];
  setComments: React.Dispatch<SetStateAction<ILemmyComment[]>>;

  self: boolean;
}

const useProfile = (
  noContent = true,
  fullUsername?: string,
  saved = false
): UseProfile => {
  const { key } = useRoute();

  const currentAccount = useCurrentAccount();
  const searchUsername = useMemo(
    () =>
      fullUsername ?? `${currentAccount.username}@${currentAccount.instance}`,
    [currentAccount]
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [profile, setProfile] = useState<PersonView>(null);
  const [comments, setComments] = useState<ILemmyComment[]>([]);

  const [notFound, setNotFound] = useState<boolean>(false);

  const self = useRef(!fullUsername);

  useEffect(() => {
    addFeed(key);
    doLoad(true).then();

    return () => {
      removeFeed(key);
    };
  }, [currentAccount]);

  const doLoad = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        sort: "New",
        limit: 50,
        page: 1,
      });

      const betterComments = buildComments(res.comments);

      if (self.current && saved) {
        const savedRes = await lemmyInstance.getPersonDetails({
          auth: lemmyAuthToken,
          limit: noContent ? 0 : 50,
          saved_only: true,
          username: searchUsername,
        });

        setFeedPosts(key, savedRes.posts);
      } else {
        setFeedPosts(key, res.posts);
      }

      setProfile(res.person_view);
      setComments(betterComments);

      if (refresh) setRefreshing(false);
      else setLoading(false);
    } catch (e) {
      if (refresh) setRefreshing(false);
      else setLoading(false);
      setError(true);

      if (e.toString() === "could_not_find_that_username_or_email") {
        setNotFound(true);
      }

      handleLemmyError(e.toString());
    }
  };

  return {
    loading,
    error,
    refreshing,
    notFound,

    profile,

    comments,
    setComments,

    self: self.current,

    doLoad,
  };
};

export default useProfile;
