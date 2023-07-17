import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { ScrollView, Text, useTheme } from "native-base";
import { CommunityView } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import useTraverse from "../../../hooks/traverse/useTraverse";
import LoadingView from "../../common/Loading/LoadingView";
import TraverseItem from "./components/TraverseItem";
import SearchBar from "../../common/Search/SearchBar";
import RefreshControl from "../../common/RefreshControl";

import { selectFavorites } from "../../../slices/favorites/favoritesSlice";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../store";
import { getCommunityFullName } from "../../../helpers/LemmyHelpers";

// Used to create an alpha-indexed list of subscriptions
interface IndexedTraverseItem {
  isIndex: boolean; // is this item an alpha index?
  index?: string; // if so, what's the index?
  subscription?: CommunityView; // if not, what's the subscription?
}

function TraverseScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const currentAccount = useAppSelector(selectCurrentAccount);
  const favorites =
    useAppSelector(selectFavorites).favorites[
      `${currentAccount.username}@${currentAccount.instance}`
    ];
  const hasFavorites = favorites && Object.keys(favorites).length > 0;

  // If there are favorites then indexing should start at 4, otherwise 3
  const startingIndex = hasFavorites ? 3 : 2;
  // If there are favorites then we'll add it as a numeric index
  const headerNumericIndexes: number[] = hasFavorites ? [1] : [];
  let lastIndexAlpha: string;
  const indexedTraverseItems: IndexedTraverseItem[] =
    traverse.subscriptions.reduce((accumulator, subscription) => {
      const { name } = subscription.community;
      // get the first letter of the name
      const firstLetter = name.at(0).toLocaleUpperCase();
      if (lastIndexAlpha !== firstLetter) {
        // track the current alpha index
        lastIndexAlpha = firstLetter;
        // add the new alpha-index
        accumulator.push({ isIndex: true, index: firstLetter });
        // keep track of the numeric index for the ScrollView sticky headers
        headerNumericIndexes.push(accumulator.length - 1 + startingIndex);
      }
      // add the subscription
      accumulator.push({ isIndex: false, index: lastIndexAlpha, subscription });
      return accumulator;
    }, []);

  const header = useMemo(
    () => <SearchBar query={term} setQuery={setTerm} autoFocus={false} />,
    [term]
  );

  const isFavorite = (community: CommunityView) => {
    const communityFullName = getCommunityFullName(community);
    return favorites ? communityFullName in favorites : false;
  };

  const item = (traverseItem: IndexedTraverseItem) => {
    const { isIndex, subscription } = traverseItem;
    if (isIndex)
      return (
        <View style={{backgroundColor: theme.colors.app.bg, paddingTop: 10, paddingStart: 18, paddingBottom: 10}}>
          <Text fontSize="xl" fontWeight="semibold" key={traverseItem.index}>{traverseItem.index}</Text>
        </View>
      );
    if (term && !subscription?.community.name.includes(term)) return null;
    return (
      <TraverseItem
        community={subscription}
        isFavorite={favorites ? isFavorite(subscription) : false}
        key={subscription?.community.id}
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
      stickyHeaderIndices={headerNumericIndexes}
    >
      {/* Index 0 */}
      {header}

      {hasFavorites && (
        /* Index 1 */
        <View flex={1}>
          <Text textAlign="center">{t("Favorites")}</Text>
          {traverse.subscriptions
            .filter((c) => isFavorite(c))
            .map((c) => item(c))}
        </View>
      )}
      {/* Index 2 OR 3 */}
      <Text textAlign="center">{t("Subscriptions")}</Text>
      {traverse.subscriptions.length === 0 ? (
        <Text
          fontStyle="italic"
          textAlign="center"
          justifyContent="center"
          alignSelf="center"
        >
          {t("traverse.noSubscriptions")}
        </Text>
      ) : (
        /* Index 3+ OR 4+ */
        indexedTraverseItems.map((c) => item(c))
      )}
    </ScrollView>
  );
}

export default TraverseScreen;
