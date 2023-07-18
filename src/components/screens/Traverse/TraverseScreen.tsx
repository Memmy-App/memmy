import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { View, ScrollView, Text, useTheme } from "native-base";
import { CommunityView } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import useTraverse from "../../../hooks/traverse/useTraverse";
import LoadingView from "../../common/Loading/LoadingView";
import TraverseItem from "./components/TraverseItem";
import SearchBar from "../../common/Search/SearchBar";
import RefreshControl from "../../common/RefreshControl";

import { selectFavorites } from "../../../slices/favorites/favoritesSlice";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../store";
import { getCommunityFullName } from "../../../helpers/LemmyHelpers";

enum ItemType {
  HEADER,
  INDEX,
  SUBSCRIPTION,
  EMPTY_RESULTS,
}

interface SectionListItem {
  type: ItemType;
  value: string | CommunityView;
  isFavorite: boolean;
}

function TraverseScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const itemFilter = (item: CommunityView) =>
    !term || item.community.name.includes(term);

  const currentAccount = useAppSelector(selectCurrentAccount);
  const favorites =
    useAppSelector(selectFavorites).favorites[
      `${currentAccount.username}@${currentAccount.instance}`
    ];

  const isFavoriteSubscription = (community: CommunityView) => {
    const communityFullName = getCommunityFullName(community);
    return favorites ? communityFullName in favorites : false;
  };

  const hasFavorites = favorites && Object.keys(favorites).length > 0;

  const filteredSubscriptions = traverse.subscriptions.filter(itemFilter);
  const filteredFavorites = filteredSubscriptions.filter((c) =>
    isFavoriteSubscription(c)
  );

  let sectionListItems: SectionListItem[] = hasFavorites
    ? [
        {
          type: ItemType.HEADER,
          value: `${t("Favorites")} (${filteredFavorites.length})`,
          isFavorite: false,
        },
      ]
    : [];

  if (filteredFavorites.length) {
    sectionListItems = sectionListItems.concat(
      filteredFavorites.map((favorite) => ({
        type: ItemType.SUBSCRIPTION,
        value: favorite,
        isFavorite: true,
      }))
    );
  } else {
    sectionListItems.push({
      type: ItemType.EMPTY_RESULTS,
      value: "EMPTY FAVORITES",
      isFavorite: false,
    });
  }

  sectionListItems.push({
    type: ItemType.HEADER,
    value: `${t("Subscriptions")} (${filteredSubscriptions.length})`,
    isFavorite: false,
  });

  let lastIndexAlpha: string;
  sectionListItems = filteredSubscriptions.reduce(
    (accumulator, subscription) => {
      const { name } = subscription.community;
      // get the first letter of the name
      const firstLetter = name.at(0).toLocaleUpperCase();
      if (lastIndexAlpha !== firstLetter) {
        // track the current alpha index
        lastIndexAlpha = firstLetter;
        // add the new alpha-index
        accumulator.push({
          type: ItemType.INDEX,
          value: firstLetter,
          isFavorite: false,
        });
      }
      // add the subscription
      accumulator.push({
        type: ItemType.SUBSCRIPTION,
        value: subscription,
        isFavorite: false,
      });
      return accumulator;
    },
    sectionListItems
  );

  const stickyHeaderIndices = sectionListItems
    .map((item, index) => {
      if (item.type === ItemType.INDEX) {
        return index;
      }
      return null;
    })
    .filter((item) => item !== null) as number[];

  const header = useMemo(
    () => <SearchBar query={term} setQuery={setTerm} autoFocus={false} />,
    [term]
  );

  const itemRenderer = ({ item }: ListRenderItemInfo<SectionListItem>) => {
    const { type, value, isFavorite } = item;
    if (type === ItemType.INDEX) {
      return (
        <View backgroundColor={theme.colors.app.bg}>
          <Text
            style={styles.alphaIndexHeaderText}
            fontSize="xl"
            fontWeight="semibold"
            key={value as string}
          >
            {value as string}
          </Text>
        </View>
      );
    } else if (type === ItemType.HEADER) {
       return (<Text textAlign="center">{value as string}</Text>);
    }
    return (
      <TraverseItem
        community={value as CommunityView}
        isFavorite={hasFavorites ? isFavoriteSubscription(value as CommunityView) : false}
        key={`${isFavorite ? "favorite" : "subscription"}-${
          (value as CommunityView)?.community.id
        }`}
      />
    );
  };

  if (traverse.loading) {
    return <LoadingView />;
  }

  return (
    <View flex={1}>
      {header}
      <FlashList
        backgroundColor={theme.colors.app.bg}
        refreshControl={
          <RefreshControl
            refreshing={traverse.refreshing}
            onRefresh={() => traverse.doLoad(true)}
          />
        }
        keyboardShouldPersistTaps="handled"
        data={sectionListItems}
        renderItem={itemRenderer}
        stickyHeaderIndices={stickyHeaderIndices}
        getItemType={(item: SectionListItem) => item.type}
        estimatedItemSize={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  alphaIndexHeaderText: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingStart: 18,
  },
  favoritesContainer: {
    marginBottom: 16,
  },
});

export default React.memo(TraverseScreen);
