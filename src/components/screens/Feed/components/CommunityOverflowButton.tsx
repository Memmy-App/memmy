import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useRoute } from "@react-navigation/core";
import { useAppDispatch } from "../../../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../../../LemmyInstance";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { getCommunityLink } from "../../../../helpers/LinkHelper";
import { writeToLog } from "../../../../helpers/LogHelper";
import { shareLink } from "../../../../helpers/ShareHelper";
import { showToast } from "../../../../slices/toast/toastSlice";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";
import { useFeedCommunityName } from "../../../../stores/feeds/feedsStore";
import { useCommunity } from "../../../../stores/communities/communitiesStore";
import { getCommunityFullName } from "../../../../helpers/LemmyHelpers";
import { ContextMenuOptions } from "../../../../types/ContextMenuOptions";
import { ICON_MAP } from "../../../../constants/IconMap";

export type Community = {
  id: number;
  name: string;
  fullName: string;
};

const options: ContextMenuOptions = {
  share: {
    display: "Share",
    icon: ICON_MAP.SHARE,
  },
  block: {
    display: "Block Community",
    icon: ICON_MAP.BLOCK_COMMUNITY,
    destructive: true,
  },
  unblock: {
    display: "Unblock Community",
    icon: ICON_MAP.BLOCK_COMMUNITY,
    destructive: false,
  },
};

function CommunityOverflowButton() {
  const { key: routeKey } = useRoute();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const communityName = useFeedCommunityName(routeKey);
  const community = communityName ? useCommunity(communityName) : undefined;

  // TODO: support unblocking community
  const onBlockCommunity = useCallback(() => {
    if (!community) return;

    onGenericHapticFeedback();
    dispatch(
      showToast({
        message: t("toast.blocked", [community.community.name]),
        duration: 3000,
        variant: "info",
      })
    );

    lemmyInstance
      .blockCommunity({
        auth: lemmyAuthToken,
        community_id: community.community.id,
        block: true,
      })
      .catch((err) => writeToLog(`ERROR: Failed to block community: ${err}`));
  }, [community]);

  const onShareCommunity = useCallback(() => {
    onGenericHapticFeedback();
    const communityLink: string = getCommunityLink(
      `/c/${getCommunityFullName(community)}`
    );
    shareLink({
      link: communityLink,
      title: community.community.name,
    });
  }, [community]);

  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        switch (nativeEvent.actionKey) {
          case "share":
            onShareCommunity();
            break;
          case "block":
            onBlockCommunity();
            break;
          default:
            break;
        }
      }}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          {
            actionKey: "share",
            actionTitle: options.share.display,
            icon: {
              type: "IMAGE_SYSTEM",
              imageValue: {
                systemName: options.share.icon,
              },
            },
          },
          {
            actionKey: "block",
            actionTitle: options.block.display,
            menuAttributes: ["destructive"],
            icon: {
              type: "IMAGE_SYSTEM",
              imageValue: {
                systemName: options.block.icon,
              },
            },
          },
        ],
      }}
    >
      <HeaderIconButton icon={<SFIcon icon="ellipsis" />} />
    </ContextMenuButton>
  );
}

export default React.memo(CommunityOverflowButton);
