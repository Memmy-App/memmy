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
  IconSelectAll,
} from "tabler-icons-react-native";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import {
  feedSortOptions,
  sortTopOptions,
} from "../../../../types/FeedSortOptions";
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
    const cancelButtonIndex = feedSortOptions.length;

    showActionSheetWithOptions(
      {
        options: [
          ...feedSortOptions.map(([key, display]) =>
            key === feed.sort ? `${display} (current)` : display
          ),
          "Cancel",
        ],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (!index || index === cancelButtonIndex) return;

        if (index === 0) {
          showTopOptions();
          return;
        }

        const [key] = feedSortOptions[index];
        feed.setSort(key);
        onSortUpdate?.(key);
      }
    );
  };

  const showTopOptions = () => {
    const cancelButtonIndex = sortTopOptions.length;

    showActionSheetWithOptions(
      {
        options: [
          ...sortTopOptions.map(([key, display]) =>
            key === feed.sort ? `${display} (current)` : display
          ),
          "Cancel",
        ],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (!index || index === cancelButtonIndex) return;

        const [key] = sortTopOptions[index];
        feed.setSort(key);
        onSortUpdate?.(key);
      }
    );
  };

  // TODO Come back to this
  // @ts-ignore
  return <HeaderIconButton icon={SortIconType[feed.sort]} onPress={onPress} />;
}

const SortIconType = {
  TopDay: <IconCalendar />,
  TopWeek: <IconCalendarWeek />,
  TopHour: <IconClockHour1 />,
  TopSixHour: <IconClockHour6 />,
  TopTwelveHour: <IconClockHour12 />,
  TopMonth: <IconCalendar />,
  TopYear: <IconCalendar />,
  TopAll: <IconSelectAll />,
  Hot: <IconFlame />,
  Active: <IconBolt />,
  New: <IconClockHour4 />,
  MostComments: <IconMessage />,
};

export default FeedSortButton;
