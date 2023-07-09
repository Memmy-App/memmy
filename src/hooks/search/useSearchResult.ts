import React, { SetStateAction, useEffect, useState } from "react";
import { PostView, SearchType } from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { writeToLog } from "../../helpers/LogHelper";
import ILemmySearchResult from "../../types/lemmy/ILemmySearchResult";

interface UseSearch {
  loading: boolean;
  error: boolean;
  result: ILemmySearchResult;
  posts: PostView[];
  setPosts: React.Dispatch<SetStateAction<PostView[]>>;
}

const useSearchResult = (query: string, type: SearchType): UseSearch => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<ILemmySearchResult>({
    posts: [],
    communities: [],
    users: [],
  });
  const [posts, setPosts] = useState<PostView[]>([]);

  useEffect(() => {
    runSearch().then();
  }, []);

  const runSearch = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await lemmyInstance!.search({
        auth: lemmyAuthToken,
        type_: type,
        q: query,
        limit: 40,
        page: 1,
        listing_type: "All",
        sort: "Active",
      });

      if (type === "Posts") {
        setPosts(res.posts);
      } else {
        setResult({
          users: res.users,
          communities: res.communities,
          posts: res.posts,
        });
      }
      setLoading(false);
    } catch (e: any) {
      writeToLog("Error searching.");
      writeToLog(e.toString());
      setLoading(false);
      setError(true);
    }
  };

  return {
    loading,
    error,

    result,

    posts,
    setPosts,
  };
};

export default useSearchResult;
