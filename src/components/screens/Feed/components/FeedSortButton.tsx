import React from "react";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { SortType } from "lemmy-js-client";
import {
  IconBolt,
  IconCalendar,
  IconClockHour1,
  IconClockHour12,
  IconClockHour4,
  IconClockHour6,
  IconFlame,
  IconMessage,
} from "tabler-icons-react-native";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { sortOptions } from "../../../../types/FeedSortOptions";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { IconCalendarWeek } from "../../../common/icons";

interface Props {
  feed: UseFeed;
  onSortUpdate?: (key: SortType) => void;
}
function FeedSortButton({ feed, onSortUpdate }: Props) {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const cancelButtonIndex = sortOptions.length;

    showActionSheetWithOptions(
      {
        options: [
          ...sortOptions.map(([key, display]) =>
            key === feed.sort ? `${display} (current)` : display
          ),
          "Cancel",
        ],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;
        const [key] = sortOptions[index];
        feed.setSort(key);
        onSortUpdate?.(key);
      }
    );
  };
  return <HeaderIconButton icon={SortIconType[feed.sort]} onPress={onPress} />;
}

const SortIconType = {
  TopDay: <IconCalendar />,
  TopWeek: <IconCalendarWeek />,
  TopHour: <IconClockHour1 />,
  TopSixHour: <IconClockHour6 />,
  TopTwelveHour: <IconClockHour12 />,
  Hot: <IconFlame />,
  Active: <IconBolt />,
  New: <IconClockHour4 />,
  MostComments: <IconMessage />,
};

export default FeedSortButton;
