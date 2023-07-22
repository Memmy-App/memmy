import { CommentSortType } from "lemmy-js-client";
import React from "react";
import { commentSortOptions } from "../../../../types/SortOptions";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { CommentSortContextMenu } from "../../../common/ContextMenu/CommentSortContextMenu";
import SFIcon from "../../../common/icons/SFIcon";

interface IProps {
  sortType: CommentSortType;
  setSortType: (sortType: CommentSortType) => void;
}

function CommentSortButton({ sortType, setSortType }: IProps) {
  return (
    <CommentSortContextMenu
      onPress={({ nativeEvent }) => {
        setSortType(nativeEvent.actionKey as CommentSortType);
      }}
      currentSelection={sortType}
    >
      <HeaderIconButton
        icon={<SFIcon icon={commentSortOptions[sortType].icon} />}
      />
    </CommentSortContextMenu>
  );
}

export default CommentSortButton;
