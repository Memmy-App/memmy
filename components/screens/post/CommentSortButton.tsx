import React from "react";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { CommentSortType } from "lemmy-js-client";
import {
  IconCalendar,
  IconClockHour4,
  IconClockHour8,
  IconFlame,
} from "tabler-icons-react-native";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";

const sortOptions = ["Top", "Hot", "New", "Old"] satisfies CommentSortType[];

interface Props {
  sortType: string;
  setSortType: (type: string) => void;
}

function CommentSortButton({ sortType, setSortType }: Props) {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const cancelButtonIndex = sortOptions.length;

    showActionSheetWithOptions(
      {
        options: [...sortOptions, "Cancel"],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;

        const key = sortOptions[index];
        setSortType(key);
      }
    );
  };
  return <HeaderIconButton icon={SortIconType[sortType]} onPress={onPress} />;
}

const SortIconType = {
  Top: <IconCalendar />,
  Hot: <IconFlame />,
  New: <IconClockHour4 />,
  Old: <IconClockHour8 />,
};

export default CommentSortButton;
