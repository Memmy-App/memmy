import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PersonView } from "lemmy-js-client";
import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch } from "../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { buildComments } from "../../helpers/LemmyHelpers";
import { setPost } from "../../slices/post/postSlice";
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

  onCommentPress: (
    postId: number,
    commentId: number | undefined
  ) => Promise<void>;
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

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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

  const onCommentPress = async (
    postId: number,
    commentId: number | undefined = undefined
  ) => {
    setLoading(true);

    try {
      const res = await lemmyInstance.getPost({
        auth: lemmyAuthToken,
        id: postId,
      });

      dispatch(setPost(res.post_view));
      setLoading(false);

      navigation.push("Post", {
        commentId: commentId.toString(),
        showLoadAll: true,
      });
    } catch (e) {
      setLoading(false);
      setError(true);

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

    onCommentPress,
  };
};

export default useProfile;
