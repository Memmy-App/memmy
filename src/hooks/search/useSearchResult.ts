import { useEffect, useState } from "react";
import { SearchType } from "lemmy-js-client";
import { useRoute } from "@react-navigation/core";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import ILemmySearchResult from "../../types/lemmy/ILemmySearchResult";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import setFeedPosts from "../../stores/feeds/actions/setFeedPosts";

interface UseSearch {
  loading: boolean;
  error: boolean;
  result: ILemmySearchResult;
}

const useSearchResult = (query: string, type: SearchType): UseSearch => {
  const { key } = useRoute<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<ILemmySearchResult>({
    posts: [],
    users: [],
    communities: [],
  });

  useEffect(() => {
    runSearch().then();
  }, []);

  const runSearch = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await lemmyInstance.search({
        auth: lemmyAuthToken,
        type_: type,
        q: query,
        limit: 40,
        page: 1,
        listing_type: "All",
        sort: "Active",
      });

      if (type === "Posts") {
        setFeedPosts(key, res.posts);
      } else {
        setResult({
          users: res.users,
          communities: res.communities,
          posts: res.posts,
        });
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(true);

      handleLemmyError(e.toString());
    }
  };

  return {
    loading,
    error,

    result,
  };
};

export default useSearchResult;
