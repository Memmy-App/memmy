import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu/src/types/MenuEvents";
import { useIsCommunityModerator } from "@src/stores/communities/communitiesStore";
import useDeletePost from "@src/hooks/post/useDeletePost";
import { useAppDispatch } from "../../../../../store";
import { useReportPost } from "../../../../hooks/post/useReportPost";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../constants/IconMap";
import {
  useCurrentPost,
  usePostCommunityName,
  usePostIsOwn,
} from "../../../../stores/posts/postsStore";
import { ContextMenuOption } from "../../../../types/ContextMenuOptions";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";

function CommentSortButton() {
  const route = useRoute<any>();
  const { postKey } = route.params;

  const post = useCurrentPost(postKey);
  const postCommunityName = usePostCommunityName(postKey);
  const isModerator = useIsCommunityModerator(postCommunityName);
  const isOwn = usePostIsOwn(postKey);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const reportPost = useReportPost();
  const deletePost = useDeletePost();

  useEffect(() => {}, []);

  const options = useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "ReportPost",
        title: t("Report Post"),
        icon: ICON_MAP.REPORT_POST,
      },
      ...(isModerator || isOwn
        ? [
            {
              key: "DeletePost",
              title: t("Delete Post"),
              icon: ICON_MAP.DELETE,
              destructive: true,
            },
          ]
        : []),
    ],
    [t]
  );

  const onPressMenuItem = ({ nativeEvent }: OnPressMenuItemEventObject) => {
    switch (nativeEvent.actionKey) {
      case "ReportPost":
        reportPost(post.post.id, dispatch);
        break;
      case "DeletePost":
        deletePost(post, true).then();
        break;
      default:
        break;
    }
  };

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onPressMenuItem}>
      <HeaderIconButton icon={<SFIcon icon={ICON_MAP.MORE_OPTIONS} />} />
    </AppContextMenuButton>
  );
}

export default CommentSortButton;
