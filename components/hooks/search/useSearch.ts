import { SearchType } from "lemmy-js-client";

interface UseSearch {
  doSearch: () => void;
}

const useSearch = () => {
  const doSearch = (value: string, type: SearchType) => {};

  return {
    doSearch,
  };
};

export default useSearch;
