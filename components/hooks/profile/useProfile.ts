import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { CommentView, PersonView, PostView } from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";

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

  useEffect(() => {
    doLoad().then();
  }, []);

  const doLoad = async (refresh = false) => {
    setLoading(true);
    setError(false);

    console.log("test");

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        sort: "New",
        limit: 20,
        page: 1,
      });

      setProfile(res.person_view);
      if (!refresh) {
        setItems(res.comments);
      }
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
    setItems([]);
    setSelectedTab(type);
    setItemsLoading(true);
    setError(false);

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        page: refresh ? 1 : nextPage,
        sort: "New",
        limit: 20,
      });

      setNextPage((prev) => (refresh ? 2 : prev + 1));

      console.log(type);

      if (type === "comments") setItems([...res.comments]);
      if (type === "posts") setItems([...res.posts]);
    } catch (e) {
      writeToLog("Failed to get user.");
      writeToLog(e.toString());

      setError(true);
      setItemsLoading(false);
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
  };
};

export default useProfile;
