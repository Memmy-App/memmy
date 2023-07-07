import React, { SetStateAction } from "react";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  IconCalendar,
  IconClockHour4,
  IconClockHour8,
  IconFlame,
} from "tabler-icons-react-native";
import { CommentSortType } from "lemmy-js-client";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { commentSortOptions } from "../../../../types/CommentSortOptions";

interface IProps {
  sortType: CommentSortType;
  setSortType: React.Dispatch<SetStateAction<CommentSortType>>;
}

function CommentSortButton({ sortType, setSortType }: IProps) {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const cancelButtonIndex = commentSortOptions.length;

    showActionSheetWithOptions(
      {
        options: [
          ...commentSortOptions.map((key): string =>
            key === sortType ? `${key} (current)` : key
          ),
          "Cancel",
        ],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;

        setSortType(commentSortOptions[index]);
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
