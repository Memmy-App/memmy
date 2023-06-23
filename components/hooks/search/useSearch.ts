import { ListingType, SearchType, SortType } from "lemmy-js-client";
import { SetStateAction, useState } from "react";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import ILemmySearchResult from "../../../lemmy/types/ILemmySearchResult";
import { writeToLog } from "../../../helpers/LogHelper";

interface UseSearch {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  doSearch: () => void;
  loading: boolean;
  error: boolean;
  result: ILemmySearchResult | null;
  searchType: SearchType | null;
}

const useSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<ILemmySearchResult>(null);
  const [searchType, setSearchType] = useState<SearchType | null>(null);

  const doSearch = async (
    type: SearchType,
    listingType: ListingType = "All"
  ) => {
    if (!query) return;

    try {
      setLoading(true);
      setError(false);
      setSearchType(type);

      const res = await lemmyInstance.search({
        auth: lemmyAuthToken,
        type_: type,
        q: query,
        limit: 15,
        page: 1,
        listing_type: listingType,
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
    query,
    setQuery,

    doSearch,

    loading,
    error,
    result,
    searchType,
  };
};

export default useSearch;
