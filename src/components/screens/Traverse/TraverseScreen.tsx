import React, { useMemo, useState } from "react";
import { ScrollView, Text, useTheme } from "native-base";
import { CommunityView } from "lemmy-js-client";
import useTraverse from "../../../hooks/traverse/useTraverse";
import LoadingView from "../../common/Loading/LoadingView";
import TraverseItem from "./components/TraverseItem";
import SearchBar from "../../common/Search/SearchBar";
import RefreshControl from "../../common/RefreshControl";

import { selectFavorites } from "../../../slices/favorites/favoritesSlice";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../store";
import { getCommunityFullName } from "../../../helpers/LemmyHelpers";

function TraverseScreen() {
  const theme = useTheme();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const currentAccount = useAppSelector(selectCurrentAccount);
  const favorites =
    useAppSelector(selectFavorites).favorites[
      `${currentAccount.username}@${currentAccount.instance}`
    ];

  const header = useMemo(
    () => <SearchBar query={term} setQuery={setTerm} autoFocus={false} />,
    [term]
  );

  const isFavorite = (community: CommunityView) => {
    const communityFullName = getCommunityFullName(community);
    return favorites ? communityFullName in favorites : false;
  };

  const item = (community: CommunityView) => {
    if (term && !community.community.name.includes(term)) return null;
    return (
      <TraverseItem
        community={community}
        isFavorite={favorites ? isFavorite(community) : false}
        key={community.community.id}
      />
    );
  };

  if (traverse.loading) {
    return <LoadingView />;
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor={theme.colors.app.bg}
      refreshControl={
        <RefreshControl
          refreshing={traverse.refreshing}
          onRefresh={() => traverse.doLoad(true)}
        />
      }
      keyboardShouldPersistTaps="handled"
    >
      {header}

      {favorites && JSON.stringify(favorites) !== "{}" && (
        <>
          <Text textAlign="center">Favorites</Text>
          {traverse.subscriptions
            .filter((c) => isFavorite(c))
            .map((c) => item(c))}
        </>
      )}
      <Text textAlign="center">Subscriptions</Text>
      {traverse.subscriptions.length === 0 ? (
        <Text
          fontStyle="italic"
          textAlign="center"
          justifyContent="center"
          alignSelf="center"
        >
          You don&apos;t have any subscriptions.
        </Text>
      ) : (
        traverse.subscriptions.map((c) => item(c))
      )}
    </ScrollView>
  );
}

export default TraverseScreen;
