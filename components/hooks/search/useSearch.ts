import { ListingType, PersonView, PostView, SearchType } from "lemmy-js-client";
import { SetStateAction, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import ILemmySearchResult from "../../../lemmy/types/ILemmySearchResult";
import { writeToLog } from "../../../helpers/LogHelper";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";
import { setPost } from "../../../slices/post/postSlice";
import { useAppDispatch } from "../../../store";

interface UseSearch {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  doSearch: (type: SearchType, listingType?: ListingType) => Promise<void>;
  loading: boolean;
  error: boolean;
  result: ILemmySearchResult | null;
  searchType: SearchType | null;
}

const useSearch = (): UseSearch => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

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

    if (query.includes("@") && query.split("@").length === 2) {
      await Alert.alert(
        "What do you want to do?",
        `It looks like ${query} may be a community or user. Where do you want to go?`,
        [
          {
            text: "User",
            onPress: () => {
              navigation.push("UserProfile", {
                fullUsername: query,
              });
            },
          },
          {
            text: "Community",
            onPress: () => {
              navigation.push("Community", {
                communityName: query.split("@")[0],
                actorId: query.split("@")[1],
                communityFullName: query,
              });
            },
          },
          {
            text: "Just Search",
            onPress: () => {
              runSearch(type, listingType);
            },
          },
        ]
      );
    } else {
      runSearch(type, listingType).then();
    }
  };

  const runSearch = async (
    type: SearchType,
    listingType: ListingType = "All"
  ) => {
    try {
      setLoading(true);
      setError(false);
      setSearchType(type);

      const res = await lemmyInstance.search({
        auth: lemmyAuthToken,
        type_: type,
        q: query,
        limit: searchType === "All" ? 15 : 40,
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
