import { useRoute } from "@react-navigation/core";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFeedCommunityName } from "@src/state/feed/feedStore";
import { useCommunity } from "@src/state/community/communityStore";
import { ContextMenuOption } from "@src/types/ContextMenuOptions";
import { ICON_MAP } from "@src/types/constants/IconMap";
import { onGenericHapticFeedback } from "@src/helpers/haptics/HapticFeedbackHelper";
import { useShowToast } from "@src/state/toast/toastStore";
import instance from "@src/Instance";
import { getCommunityLink } from "@src/helpers/links";
import { getCommunityFullName } from "@src/helpers/lemmy";
import { shareLink } from "@src/helpers/share";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";
import HeaderIconButton from "@src/components/common/Button/HeaderIconButton";

export type Community = {
  id: number;
  name: string;
  fullName: string;
};

function CommunityOverflowButton() {
  const { key: routeKey } = useRoute();

  const { t } = useTranslation();
  const showToast = useShowToast();

  const communityName = useFeedCommunityName(routeKey);
  const community = communityName ? useCommunity(communityName) : undefined;

  const options: ContextMenuOption[] = [
    {
      key: "share",
      title: t("Share"),
      icon: ICON_MAP.SHARE,
    },
    ...(community?.blocked
      ? [
          {
            key: "unblock",
            title: t("Unblock Community"),
            icon: ICON_MAP.UNBLOCK,
          },
        ]
      : [
          {
            key: "block",
            title: t("Block Community"),
            icon: ICON_MAP.BLOCK,
            destructive: true,
          },
        ]),
  ];

  // TODO: support unblocking community
  const onBlockCommunity = useCallback(() => {
    if (!community) return;

    onGenericHapticFeedback();

    showToast({
      message: t("toast.blocked", [community.community.name]),
      duration: 3000,
      variant: "info",
    });

    instance.blockCommunity(community.community.id, !community.blocked);
  }, [community]);

  const onShareCommunity = useCallback(() => {
    onGenericHapticFeedback();
    const communityLink: string = getCommunityLink(
      `/c/${getCommunityFullName(community)}`
    );
    shareLink({
      link: communityLink,
      title: community?.community.name,
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
      <HeaderIconButton icon={ICON_MAP.MORE_OPTIONS} />
    </AppContextMenuButton>
  );
}

export default React.memo(CommunityOverflowButton);
