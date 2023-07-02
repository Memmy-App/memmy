import React from "react";
import { CommunityView } from "lemmy-js-client";
import { Spinner, View } from "native-base";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import MTable from "../table/MTable";
import SearchCommunityItem from "./SearchCommunityItem";

interface IProps {
  communities: CommunityView[];
}

function SearchTrendingList({ communities }: IProps) {
  if (communities.length === 0) {
    return (
      <View py={4} alignItems="center" justifyContent="center">
        <Spinner />
      </View>
    );
  }

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp}>
      <View p={4}>
        <MTable header="Trending">
          {communities.map((c) => (
            <SearchCommunityItem community={c} />
          ))}
        </MTable>
      </View>
    </Animated.View>
  );
}

export default SearchTrendingList;
