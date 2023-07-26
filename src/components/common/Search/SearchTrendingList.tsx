import React from "react";
import { CommunityView } from "lemmy-js-client";
import { Spinner, View } from "@src/components/common/Gluestack";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import MTable from "../Table/MTable";
import SearchCommunityItem from "./SearchCommunityItem";

interface IProps {
  communities: CommunityView[];
}

function SearchTrendingList({ communities }: IProps) {
  const { t } = useTranslation();

  if (communities.length === 0) {
    return (
      <View py="$4" alignItems="center" justifyContent="center">
        <Spinner />
      </View>
    );
  }

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp}>
      <MTable header={t("Trending")}>
        {communities.map((c) => (
          <SearchCommunityItem key={c.community.id} community={c} />
        ))}
      </MTable>
    </Animated.View>
  );
}

export default SearchTrendingList;
