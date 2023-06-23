import { useEffect, useState } from "react";
import {
  CommentView,
  PersonViewSafe,
  PostView,
  SortType,
} from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";

interface UseProfile {
  loading: boolean;
  error: boolean;
  profile: PersonViewSafe;
  posts: PostView[];
  comments: CommentView[];
  doLoad: () => Promise<void>;
  self: boolean;
}

const useProfile = (fullUsername?: string): UseProfile => {
  const currentAccount = useAppSelector(selectCurrentAccount);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [profile, setProfile] = useState<PersonViewSafe>(null);
  const [posts, setPosts] = useState<PostView[]>(null);
  const [comments, setComments] = useState<CommentView[]>(null);
  const [self] = useState(!fullUsername);

  useEffect(() => {
    doLoad().then();
  }, []);

  const doLoad = async () => {
    let searchUsername = fullUsername;

    if (!fullUsername) {
      searchUsername = `${currentAccount.username}@${currentAccount.instance}`;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await lemmyInstance.getPersonDetails({
        auth: lemmyAuthToken,
        username: searchUsername,
        sort: "New",
        limit: 20,
      });

      setProfile(res.person_view);
      setComments(res.comments);
      setPosts(res.posts);
      setLoading(false);
    } catch (e) {
      writeToLog("Error getting person.");
      writeToLog(e.toString());

      setLoading(false);
      setError(true);
    }
  };

  return {
    loading,
    error,
    profile,
    posts,
    comments,
    self,

    doLoad,
  };
};

export default useProfile;
