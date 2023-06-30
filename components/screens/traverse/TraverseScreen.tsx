import React, { useMemo, useState } from "react";
import { ScrollView, useTheme } from "native-base";
import { CommunityView } from "lemmy-js-client";
import useTraverse from "../../hooks/traverse/useTraverse";
import LoadingView from "../../ui/Loading/LoadingView";
import TraverseItem from "../../ui/traverse/TraverseItem";
import SearchBar from "../../ui/search/SearchBar";

function TraverseScreen() {
  const theme = useTheme();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const header = useMemo(
    () => <SearchBar searchValue={term} onSearchChange={setTerm} />,
    [term]
  );

  const item = (community: CommunityView) => {
    if (term && !community.community.name.includes(term)) return null;

    return <TraverseItem community={community} key={community.community.id} />;
  };

  return useMemo(() => {
    if (traverse.loading) {
      return <LoadingView />;
    }

    return (
      <ScrollView flex={1} backgroundColor={theme.colors.app.bg}>
        {header}
        {traverse.subscriptions.map((c) => item(c))}
      </ScrollView>
    );
  }, [traverse.subscriptions, traverse.loading, traverse.error, term]);
}

export default TraverseScreen;
