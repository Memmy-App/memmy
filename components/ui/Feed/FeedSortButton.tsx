import { useTheme } from "native-base";
import HeaderIconButton from "../buttons/HeaderIconButton";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { UseFeed } from "../../hooks/feeds/useFeed";
import { SortType } from "lemmy-js-client";
import {
  IconBolt,
  IconCalendar,
  IconClockHour4,
  IconFlame,
  IconMessage,
} from "tabler-icons-react-native";
import { IconCalendarWeek } from "../customIcons";

type SortOption = [key: SortType, display: string];

const sortOptions = [
  ["TopDay", "Top Day"],
  ["TopWeek", "Top Week"],
  ["Hot", "Hot"],
  ["Active", "Active"],
  ["New", "New"],
  ["MostComments", "Most Comments"],
] satisfies SortOption[];

interface Props {
  feed: UseFeed;
  onSortUpdate?: (key: SortType) => void;
}

export const FeedSortButton = ({ feed, onSortUpdate }: Props) => {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const cancelButtonIndex = sortOptions.length;

    showActionSheetWithOptions(
      {
        options: [...sortOptions.map(([, display]) => display), "Cancel"],
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
};

const SortIconType = {
  TopDay: <IconCalendar />,
  TopWeek: <IconCalendarWeek />,
  Hot: <IconFlame />,
  Active: <IconBolt />,
  New: <IconClockHour4 />,
  MostComments: <IconMessage />,
};
