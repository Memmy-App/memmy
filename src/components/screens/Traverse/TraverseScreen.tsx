import React, { useMemo, useState } from "react";
import { ScrollView, Text, useTheme, View } from "native-base";
import { CommunityView } from "lemmy-js-client";
import useTraverse from "../../../hooks/traverse/useTraverse";
import LoadingView from "../../common/Loading/LoadingView";
import TraverseItem from "./components/TraverseItem";
import SearchBar from "../../common/Search/SearchBar";
import RefreshControl from "../../common/RefreshControl";

import { selectFavorites } from "../../../slices/favorites/favoritesSlice";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../store";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";

function TraverseScreen() {
  const theme = useTheme();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const currentAccount = useAppSelector(selectCurrentAccount);
  const favorites = useAppSelector(selectFavorites).favorites[`${currentAccount.username}@${currentAccount.instance}`];
  console.log(`Favorites: ${JSON.stringify(favorites)}`);
  console.log(`Favorites isEmpty: ${JSON.stringify(favorites) === '{}'}`)

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<CommunityView>) => {
      if (term && !item.community.name.includes(term)) return null;
      return <TraverseItem community={item} isFavorite={favorites ? isFavorite(item) : false} key={item.community.id} />;
    },
    [traverse.subscriptions]
  );

  const header = useMemo(
    () => <SearchBar query={term} setQuery={setTerm} autoFocus={false} />,
    [term]
  );

  const isFavorite = (community: CommunityView) => {
    let comm_name = `${community.community.name}@${getBaseUrl(community.community.actor_id)}`
    return comm_name in favorites;
  }

  const item = (community: CommunityView) => {
    if (term && !community.community.name.includes(term)) return null;
    return <TraverseItem community={community} isFavorite={favorites ? isFavorite(community) : false} key={community.community.id} />;
  };

  if (traverse.loading) {
    return <LoadingView />;
  }

  return (
    // <ScrollView 
    //   flex={1}
    //   backgroundColor={theme.colors.app.bg}
    // >
    //   {header}
    //   <Text textAlign="center">Favorites</Text>
    //   <FlashList
    //     renderItem={renderItem}
    //     data={traverse.subscriptions.filter((c) => isFavorite(c))}
    //     refreshControl={
    //       <RefreshControl
    //         refreshing={traverse.refreshing}
    //         onRefresh={() => traverse.doLoad(true)}
    //       />
    //     }
    //     estimatedItemSize={71}
    //   />
    //   <Text textAlign="center">Subscriptions</Text>
    //   <FlashList
    //     renderItem={renderItem}
    //     data={traverse.subscriptions}
    //     refreshControl={
    //       <RefreshControl
    //         refreshing={traverse.refreshing}
    //         onRefresh={() => traverse.doLoad(true)}
    //       />
    //     }
    //     estimatedItemSize={71}
    //   />
    // </ScrollView>
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
      
      {JSON.stringify(favorites) !== '{}' &&
        <>
          <Text
            textAlign="center"
          >
            Favorites
          </Text>
          {traverse.subscriptions.filter((c) => isFavorite(c)).map((c) => item(c))}
        </>
      }
      <Text
        textAlign="center"
      >
        Subscriptions
      </Text>
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
