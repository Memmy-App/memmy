import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu/src/types/MenuEvents";
import { useIsCommunityModerator } from "@src/stores/communities/communitiesStore";
import useDeletePost from "@src/hooks/post/useDeletePost";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";
import setPostFeatured from "@src/stores/posts/actions/setPostFeatured";
import setPostLocked from "@src/stores/posts/actions/setPostLocked";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { showToast } from "@src/slices/toast/toastSlice";
import Clipboard from "@react-native-community/clipboard";
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

function PostOptionsButton() {
  const route = useRoute<any>();
  const { postKey } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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

      ...(post.post.body
        ? [
            {
              key: "CopyAllText",
              title: t("Copy All Text"),
              icon: ICON_MAP.COPY,
            },
            {
              key: "CopySelectedText",
              title: t("Copy Selected Text"),
              icon: ICON_MAP.COPY,
            },
          ]
        : []),
      ...(isOwn
        ? [
            {
              key: "DeletePost",
              title: t("Delete Post"),
              icon: ICON_MAP.DELETE,
              destructive: true,
            },
          ]
        : []),
      ...(isModerator
        ? [
            {
              key: post.post.locked ? "UnlockPost" : "Lock Post",
              title: post.post.locked ? t("mod.unlockPost") : t("mod.lockPost"),
              icon: post.post.locked ? ICON_MAP.UNLOCK : ICON_MAP.LOCK,
            },
            {
              key: post.post.featured_community
                ? "FeaturePost"
                : "Unfeature Post",
              title: post.post.featured_community
                ? t("mod.featurePost")
                : t("mod.unfeaturePost"),
              icon: post.post.featured_community
                ? ICON_MAP.UNPIN
                : ICON_MAP.PIN,
            },
            {
              key: "RemovePost",
              title: t("Remove Post"),
              icon: ICON_MAP.DELETE,
              destructive: true,
            },
          ]
        : []),
    ],
    [t]
  );

  const onPressMenuItem = async ({
    nativeEvent,
  }: OnPressMenuItemEventObject) => {
    switch (nativeEvent.actionKey) {
      case "ReportPost":
        reportPost(post.post.id, dispatch);
        break;
      case "CopyAllText":
        Clipboard.setString(post.post.body ?? "");

        dispatch(
          showToast({
            message: t("toast.textCopied"),
          })
        );
        break;
      case "CopySelectedText":
        navigation.push("CopyText", { text: post.post.body });

        break;
      case "DeletePost":
        deletePost(post, true).then();
        break;
      case "FeaturePost" || "UnfeaturePost":
        setPostFeatured(
          postKey,
          nativeEvent.actionKey === "FeaturePost"
        ).then();
        break;
      case "LockPost" || "UnlockPost":
        setPostLocked(postKey, nativeEvent.actionKey === "LockPost").then();
        break;
      case "RemovePost":
        try {
          await lemmyInstance.removePost({
            auth: lemmyAuthToken,
            removed: true,
            post_id: post.post.id,
          });

          dispatch(
            showToast({
              message: "Post Removed",
              duration: 3000,
              variant: "success",
            })
          );

          navigation.pop();
        } catch (e) {
          handleLemmyError(e.toString());
        }
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

export default PostOptionsButton;
