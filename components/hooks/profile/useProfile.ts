import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PersonView, PostView } from "lemmy-js-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { setPost } from "../../../slices/post/postSlice";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import { buildComments } from "../../../lemmy/LemmyHelpers";

export interface UseProfile {
  doLoad: (refresh?: boolean) => Promise<void>;

  loading: boolean;
  error: boolean;
  refreshing: boolean;
  notFound: boolean;

  profile: PersonView;

  comments: ILemmyComment[];
  setComments: React.Dispatch<SetStateAction<ILemmyComment[]>>;

  posts: PostView[];
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;

  savedPosts: PostView[];
  setSavedPosts: React.Dispatch<SetStateAction<PostView[]>>;

  self: boolean;

  selected?: "comments" | "posts" | "savedposts";
  setSelected?: React.Dispatch<
    SetStateAction<"comments" | "posts" | "savedposts">
  >;

  onCommentPress: (
    postId: number,
    commentId: number | undefined
  ) => Promise<void>;
}

const useProfile = (fullUsername?: string): UseProfile => {
  const currentAccount = useAppSelector(selectCurrentAccount);
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
  const [posts, setPosts] = useState<PostView[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostView[]>([]);

  const [notFound, setNotFound] = useState<boolean>(false);

  const commentsNextPage = useRef(1);
  const postsNextPage = useRef(1);

  const self = useRef(!fullUsername);

  const [selected, setSelected] = useState<"posts" | "comments">("comments");

  useEffect(() => {
    doLoad(true).then();
  }, [currentAccount]);

  const doLoad = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);

      if (selected === "comments") commentsNextPage.current = 1;
      else postsNextPage.current = 1;
    } else setLoading(true);

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        sort: "New",
        limit: 50,
        page:
          selected === "comments"
            ? commentsNextPage.current
            : postsNextPage.current,
      });

      if (selected === "comments") {
        commentsNextPage.current = 2;
      } else {
        postsNextPage.current = 2;
      }

      const betterComments = buildComments(res.comments);

      if (self.current) {
        const savedRes = await lemmyInstance.getPersonDetails({
          auth: lemmyAuthToken,
          limit: 50,
          saved_only: true,
          username: searchUsername,
        });

        setSavedPosts([...savedRes.posts]);
      }

      setProfile(res.person_view);
      setComments(betterComments);
      setPosts(res.posts);

      if (refresh) setRefreshing(false);
      else setLoading(false);
    } catch (e) {
      writeToLog("Error getting person.");
      writeToLog(e.toString());

      if (refresh) setRefreshing(false);
      else setLoading(false);

      if (e.toString() === "couldnt_find_that_username_or_email") {
        setNotFound(true);
        return;
      }
      setError(true);
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
      });
    } catch (e) {
      writeToLog("Failed to get post for comment push.");
      writeToLog(e.toString());

      setLoading(false);
      setError(true);
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

    posts,
    setPosts,

    savedPosts,
    setSavedPosts,

    selected,
    setSelected,

    self: self.current,

    doLoad,

    onCommentPress,
  };
};

export default useProfile;
