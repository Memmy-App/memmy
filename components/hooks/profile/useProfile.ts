import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { CommentView, PersonView, PostView } from "lemmy-js-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { setPost } from "../../../slices/post/postSlice";

interface UseProfile {
  loading: boolean;
  error: boolean;
  notFound: boolean;
  profile: PersonView;
  items: CommentView[] | PostView[];
  doLoad: (refresh?: boolean) => Promise<void>;
  doLoadItems: (type: "comments" | "posts", refresh?: boolean) => Promise<void>;
  self: boolean;
  selectedTab?: "comments" | "posts";
  setSelectedTab?: React.Dispatch<SetStateAction<"comments" | "posts">>;
  itemsLoading: boolean;
  onCommentPress: (
    postId: number,
    commentId: number | undefined
  ) => Promise<void>;
}

const useProfile = (fullUsername?: string): UseProfile => {
  const currentAccount = useAppSelector(selectCurrentAccount);
  const searchUsername = useMemo(
    () => `${currentAccount.username}@${currentAccount.instance}`,
    [currentAccount]
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [profile, setProfile] = useState<PersonView>(null);
  const [items, setItems] = useState<CommentView[] | PostView[]>([]);
  const [itemsLoading, setItemsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<number>(2);
  const [self] = useState(!fullUsername);
  const [selectedTab, setSelectedTab] = useState<"posts" | "comments">(
    "comments"
  );

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    doLoad().then();
  }, []);

  useEffect(() => {
    console.log("render");
  });

  const doLoad = async () => {
    setLoading(true);
    setError(false);
    setItems([]);
    setSelectedTab("comments");
    setNextPage(2);

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        sort: "New",
        limit: 50,
        page: 1,
      });

      setProfile(res.person_view);
      setItems(res.comments);
      setLoading(false);
    } catch (e) {
      writeToLog("Error getting person.");
      writeToLog(e.toString());

      setLoading(false);

      if (e.toString() === "couldnt_find_that_username_or_email") {
        setNotFound(true);
        return;
      }
      setError(true);
    }
  };

  const doLoadItems = async (type: "comments" | "posts", refresh = false) => {
    if (refresh) {
      setItems([]);
      setSelectedTab(type);
    }
    setItemsLoading(true);
    setError(false);

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        page: refresh ? 1 : nextPage,
        sort: "New",
        limit: 50,
      });

      setNextPage((prev) => (refresh ? 2 : prev + 1));

      if (type === "comments")
        setItems([...(items as CommentView[]), ...res.comments]);
      if (type === "posts") setItems([...(items as PostView[]), ...res.posts]);
    } catch (e) {
      writeToLog("Failed to get user.");
      writeToLog(e.toString());

      setError(true);
      setItemsLoading(false);
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
    notFound,
    profile,
    items,
    self,

    selectedTab,
    setSelectedTab,

    doLoad,
    doLoadItems,
    itemsLoading,

    onCommentPress,
  };
};

export default useProfile;
