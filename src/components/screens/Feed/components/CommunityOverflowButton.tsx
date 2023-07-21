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

export type Community = {
  id: number;
  name: string;
  fullName: string;
};

const options = ["Share", "Block Community"];

const optionIcons = {
  Share: "square.and.arrow.up",
  "Block Community": "xmark.circle",
};

function CommunityOverflowButton() {
  const { key } = useRoute();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const communityName = useFeedCommunityName(key);
  const community = communityName ? useCommunity(communityName) : undefined;

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
          case "Share":
            onShareCommunity();
            break;
          case "Block Community":
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
          ...options.map((option) => ({
            actionKey: option,
            actionTitle: option,
            icon: {
              type: "IMAGE_SYSTEM",
              imageValue: {
                systemName: optionIcons[option],
              },
            },
          })),
        ],
      }}
    >
      <HeaderIconButton icon={<SFIcon icon="ellipsis" />} />
    </ContextMenuButton>
  );
}

export default React.memo(CommunityOverflowButton);
