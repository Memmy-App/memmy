import React from "react";
import {
  IconChevronRight,
  IconNote,
  IconPlanet,
  IconUser,
} from "tabler-icons-react-native";
import { useTheme } from "native-base";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import MTable from "../Table/MTable";
import MCell from "../Table/MCell";

interface IProps {
  options: {
    onPostsPress: () => void;
    onUsersPress: () => void;
    onCommunitiesPress: () => void;
  };
}

function SearchOptionsList({ options }: IProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
      <MTable header={t("searchOptions.header")}>
        <MCell
          title={t("searchOptions.communities")}
          onPress={options.onCommunitiesPress}
          icon={<IconPlanet color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
        <MCell
          title={t("searchOptions.users")}
          onPress={options.onUsersPress}
          icon={<IconUser color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
        <MCell
          title={t("searchOptions.posts")}
          onPress={options.onPostsPress}
          icon={<IconNote color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
      </MTable>
    </Animated.View>
  );
}

export default SearchOptionsList;
