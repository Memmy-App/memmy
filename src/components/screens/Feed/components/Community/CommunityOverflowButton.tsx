import { useRoute } from "@react-navigation/core";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../../../../LemmyInstance";
import { ICON_MAP } from "../../../../../constants/IconMap";
import { onGenericHapticFeedback } from "../../../../../helpers/HapticFeedbackHelpers";
import { getCommunityFullName } from "../../../../../helpers/LemmyHelpers";
import { getCommunityLink } from "../../../../../helpers/LinkHelper";
import { writeToLog } from "../../../../../helpers/LogHelper";
import { shareLink } from "../../../../../helpers/ShareHelper";
import { showToast } from "../../../../../slices/toast/toastSlice";
import { useCommunity } from "../../../../../stores/communities/communitiesStore";
import { useFeedCommunityName } from "../../../../../stores/feeds/feedsStore";
import { ContextMenuOption } from "../../../../../types/ContextMenuOptions";
import HeaderIconButton from "../../../../common/Buttons/HeaderIconButton";
import { AppContextMenuButton } from "../../../../common/ContextMenu/App/AppContextMenuButton";
import SFIcon from "../../../../common/icons/SFIcon";

export type Community = {
  id: number;
  name: string;
  fullName: string;
};

function CommunityOverflowButton() {
  const { key: routeKey } = useRoute();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const communityName = useFeedCommunityName(routeKey);
  const community = communityName ? useCommunity(communityName) : undefined;

  const options: ContextMenuOption[] = [
    {
      key: "share",
      title: "Share",
      icon: ICON_MAP.SHARE,
    },
    ...(community.blocked
      ? [
          {
            key: "unblock",
            title: "Unblock Community",
            icon: ICON_MAP.UNBLOCK,
          },
        ]
      : [
          {
            key: "block",
            title: "Block Community",
            icon: ICON_MAP.BLOCK,
            destructive: true,
          },
        ]),
  ];

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
    <AppContextMenuButton
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
      options={options}
    >
      <HeaderIconButton icon={<SFIcon icon={ICON_MAP.MORE_OPTIONS} />} />
    </AppContextMenuButton>
  );
}

export default React.memo(CommunityOverflowButton);
