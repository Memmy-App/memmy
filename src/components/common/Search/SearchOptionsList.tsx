import React from "react";
import { useTranslation } from "react-i18next";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { ICON_MAP } from "../../../constants/IconMap";
import MCell from "../Table/MCell";
import MTable from "../Table/MTable";
import SFIcon from "../icons/SFIcon";
import { PlanetIcon } from "../icons/PlanetIcon";

interface IProps {
  options: {
    onPostsPress: () => void;
    onUsersPress: () => void;
    onCommunitiesPress: () => void;
  };
}

function SearchOptionsList({ options }: IProps) {
  const { t } = useTranslation();

  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
      <MTable header={t("searchOptions.header")}>
        <MCell
          title={t("searchOptions.communities")}
          onPress={options.onCommunitiesPress}
          icon={<PlanetIcon />}
          showChevron
        />
        <MCell
          title={t("searchOptions.users")}
          onPress={options.onUsersPress}
          icon={<SFIcon icon={ICON_MAP.USER_AVATAR} />}
          showChevron
        />
        <MCell
          title={t("searchOptions.posts")}
          onPress={options.onPostsPress}
          icon={<SFIcon icon={ICON_MAP.POST} />}
          showChevron
        />
      </MTable>
    </Animated.View>
  );
}

export default SearchOptionsList;
