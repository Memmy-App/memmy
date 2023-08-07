import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@src/components/common/Gluestack";
import { useAppSelector } from "@root/store";
import { CommunityView } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import useTraverse from "../../../hooks/traverse/useTraverse";
import LoadingView from "../../common/Loading/LoadingView";
import TraverseItem from "./components/TraverseItem";
import SearchBar from "../../common/Search/SearchBar";
import RefreshControl from "../../common/RefreshControl";

import { getCommunityFullName } from "../../../helpers/LemmyHelpers";
import { selectFavorites } from "../../../slices/favorites/favoritesSlice";
import { useCurrentAccount } from "../../../stores/account/accountStore";

enum ItemType {
  HEADER,
  INDEX,
  SUBSCRIPTION,
  EMPTY_RESULTS,
}

interface HeaderValue {
  id: string;
  title: string;
}

interface SectionListItem {
  type: ItemType;
  value: string | CommunityView | HeaderValue;
  isFavorite: boolean;
}

function TraverseScreen() {
  const { t } = useTranslation();
  const theme = useThemeOptions();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const itemFilter = (item: CommunityView) =>
    !term || item.community.name.toLowerCase().includes(term.toLowerCase());

  const currentAccount = useCurrentAccount();
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

  // If there are favorites, add the header, otherwise start with an empty list
  let sectionListItems: SectionListItem[] = hasFavorites
    ? [
        {
          type: ItemType.HEADER,
          value: {
            id: "favoritesHeader",
            title: `${t("Favorites")} (${filteredFavorites.length})`,
          },
          isFavorite: false,
        },
      ]
    : [];

  // Don't bother processing favorites if there are none
  if (hasFavorites) {
    // If the filtered favorites is empty, show a message
    if (term && !filteredFavorites.length) {
      sectionListItems.push({
        type: ItemType.EMPTY_RESULTS,
        value: {
          id: "favoritesEmptyResults",
          title: t("traverse.noFavoritesFiltered"),
        },
        isFavorite: false,
      });
    } else {
      // Otherwise
      sectionListItems = sectionListItems.concat(
        filteredFavorites.map((favorite) => ({
          type: ItemType.SUBSCRIPTION,
          value: favorite,
          isFavorite: true,
        }))
      );
    }
  }

  // Add the subscriptions header
  sectionListItems.push({
    type: ItemType.HEADER,
    value: {
      id: "subscriptionsHeader",
      title: `${t("Subscriptions")} (${filteredSubscriptions.length})`,
    },
    isFavorite: false,
  });

  // If there are no subscriptions, show a message
  if (!traverse.subscriptions.length) {
    sectionListItems.push({
      type: ItemType.EMPTY_RESULTS,
      value: {
        id: "subscriptionsEmptyResults",
        title: t("traverse.noSubscriptions"),
      },
      isFavorite: false,
    });
  } else if (term && !filteredSubscriptions.length) {
    // If there are no results in the search, show a message
    sectionListItems.push({
      type: ItemType.EMPTY_RESULTS,
      value: {
        id: "subscriptionsFilteredEmptyResults",
        title: t("traverse.noSubscriptionsFiltered"),
      },
      isFavorite: false,
    });
  } else {
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
            value: {
              id: firstLetter,
              title: firstLetter,
            },
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
  }

  // Extract the indices of the alpha indexes
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

  // Extract the keys. This significantly improves performance
  const keyExtractor = (item: SectionListItem): string => {
    const { type, value, isFavorite } = item;
    if (type === ItemType.SUBSCRIPTION) {
      return `${isFavorite ? "favorite" : "subscription"}-${
        (value as CommunityView)?.community.id
      }`;
    }
    return (value as HeaderValue).id;
  };

  const itemRenderer = useCallback(
    ({ item, index }: ListRenderItemInfo<SectionListItem>) => {
      const { type, value } = item;
      if (type === ItemType.INDEX) {
        return (
          <Text
            style={styles.alphaIndexHeaderText}
            size="xl"
            fontWeight="semibold"
          >
            {(value as HeaderValue).title}
          </Text>
        );
      } else if (type === ItemType.HEADER) {
        return (
          <Text
            textAlign="center"
            style={index > 0 ? styles.n1PlusHeader : null}
          >
            {(value as HeaderValue).title}
          </Text>
        );
      } else if (type === ItemType.SUBSCRIPTION) {
        return (
          <TraverseItem
            community={value as CommunityView}
            isFavorite={
              hasFavorites
                ? isFavoriteSubscription(value as CommunityView)
                : false
            }
          />
        );
      } else if (type === ItemType.EMPTY_RESULTS) {
        return (
          <Text
            fontStyle="italic"
            textAlign="center"
            justifyContent="center"
            alignSelf="center"
            py="$3"
            px="$4"
          >
            {(value as HeaderValue).title}
          </Text>
        );
      }
      return null;
    },
    []
  );

  if (traverse.loading) {
    return <LoadingView />;
  }

  return (
    <View flex={1} style={{ backgroundColor: theme.colors.bg }}>
      {header}
      <FlashList
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
        keyExtractor={keyExtractor}
        estimatedItemSize={90}
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
  n1PlusHeader: {
    marginTop: 16,
  },
  emptyResult: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default React.memo(TraverseScreen);
