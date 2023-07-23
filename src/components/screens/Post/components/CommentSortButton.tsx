import { CommentSortType } from "lemmy-js-client";
import React from "react";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { CommentSortContextMenu } from "../../../common/ContextMenu/CommentSortContextMenu";
import SFIcon from "../../../common/icons/SFIcon";
import { useCommentSortOptions } from "../../../../hooks/contextMenu/useCommentSortOptions";

interface IProps {
  sortType: CommentSortType;
  setSortType: (sortType: CommentSortType) => void;
}

function CommentSortButton({ sortType, setSortType }: IProps) {
  const commentSortOptions = useCommentSortOptions();

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
