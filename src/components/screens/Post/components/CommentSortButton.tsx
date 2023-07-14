import { CommentSortType } from "lemmy-js-client";
import React, { SetStateAction } from "react";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { commentSortOptions } from "../../../../types/CommentSortOptions";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";

interface IProps {
  sortType: CommentSortType;
  setSortType: React.Dispatch<SetStateAction<CommentSortType>>;
}

function CommentSortButton({ sortType, setSortType }: IProps) {
  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        setSortType(nativeEvent.actionKey as CommentSortType);
      }}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          ...commentSortOptions.map((option) => ({
            actionKey: option,
            actionTitle: option,
            menuState: sortType === option ? "on" : "off",
            icon: {
              type: "IMAGE_SYSTEM",
              imageValue: {
                systemName: SortIconType[option],
              },
            },
          })),
        ],
      }}
    >
      <HeaderIconButton icon={<SFIcon icon={SortIconType[sortType]} />} />
    </ContextMenuButton>
  );
}

const SortIconType: Record<CommentSortType, string> = {
  Top: "clock",
  Hot: "flame",
  New: "alarm",
  Old: "hourglass",
};

export default CommentSortButton;
