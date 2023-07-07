import React from "react";
import {
  IconChevronRight,
  IconNote,
  IconPlanet,
  IconUser,
} from "tabler-icons-react-native";
import { useTheme } from "native-base";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import MTable from "../table/MTable";
import MCell from "../table/MCell";

interface IProps {
  options: {
    onPostsPress: () => void;
    onUsersPress: () => void;
    onCommunitiesPress: () => void;
  };
}

function SearchOptionsList({ options }: IProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
      <MTable header="Select An Option">
        <MCell
          title="Search Communities"
          onPress={options.onCommunitiesPress}
          icon={<IconPlanet color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
        <MCell
          title="Search Users"
          onPress={options.onUsersPress}
          icon={<IconUser color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
        <MCell
          title="Search Posts"
          onPress={options.onPostsPress}
          icon={<IconNote color={theme.colors.app.accent} />}
          rightAccessory={<IconChevronRight color={theme.colors.app.accent} />}
        />
      </MTable>
    </Animated.View>
  );
}

export default SearchOptionsList;
