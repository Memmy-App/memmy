import { useEffect, useState } from "react";
import { SearchType } from "lemmy-js-client";
import ILemmySearchResult from "../../../lemmy/types/ILemmySearchResult";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";

interface UseSearch {
  loading: boolean;
  error: boolean;
  result: ILemmySearchResult;
}

const useSearchResult = (query: string, type: SearchType): UseSearch => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<ILemmySearchResult>(null);

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

      setResult({
        users: res.users,
        communities: res.communities,
        posts: res.posts,
      });
      setLoading(false);
    } catch (e) {
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
  };
};

export default useSearchResult;
