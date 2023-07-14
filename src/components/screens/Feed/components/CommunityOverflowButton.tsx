import React from "react";
import { useTranslation } from "react-i18next";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch } from "../../../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../../../LemmyInstance";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { getCommunityLink } from "../../../../helpers/LinkHelper";
import { writeToLog } from "../../../../helpers/LogHelper";
import { shareLink } from "../../../../helpers/ShareHelper";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { showToast } from "../../../../slices/toast/toastSlice";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";

export type Community = {
  id: number;
  name: string;
  fullName: string;
};

interface Props {
  feed: UseFeed;
  community: Community;
  onPress?: () => void;
}

const options = ["Share", "Block Community"];

const optionIcons = {
  Share: "square.and.arrow.up",
  "Block Community": "xmark.circle",
};

export default function CommunityOverflowButton({
  community,
}: Required<Pick<Props, "community">>) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onBlockCommunity = () => {
    onGenericHapticFeedback();
    dispatch(
      showToast({
        message: t("toast.blocked", [community.name]),
        duration: 3000,
        variant: "info",
      })
    );

    lemmyInstance
      .blockCommunity({
        auth: lemmyAuthToken,
        community_id: community.id,
        block: true,
      })
      .catch((err) => writeToLog(`ERROR: Failed to block community: ${err}`));
  };

  const onShareCommunity = () => {
    onGenericHapticFeedback();
    const communityLink: string = getCommunityLink(`/c/${community.fullName}`);
    shareLink({
      link: communityLink,
      title: community.name,
    });
  };

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
