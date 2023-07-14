import { useActionSheet } from "@expo/react-native-action-sheet";
import { useTheme } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { IconDots } from "tabler-icons-react-native";
import { useAppDispatch } from "../../../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../../../LemmyInstance";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { getCommunityLink } from "../../../../helpers/LinkHelper";
import { writeToLog } from "../../../../helpers/LogHelper";
import { shareLink } from "../../../../helpers/ShareHelper";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { showToast } from "../../../../slices/toast/toastSlice";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";

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

const overflowOptions = {
  community: ["Share", "Block Community", "Cancel"],
};

export default function CommunityOverflowButton({
  community,
}: Required<Pick<Props, "community">>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const cancelButtonIndex = overflowOptions.community.length - 1;

    showActionSheetWithOptions(
      {
        options: overflowOptions.community,
        cancelButtonIndex: overflowOptions.community.length - 1,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;

        if (overflowOptions.community[index] === "Block Community") {
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
            .catch((err) =>
              writeToLog(`ERROR: Failed to block community: ${err}`)
            );
        } else if (overflowOptions.community[index] === "Share") {
          onGenericHapticFeedback();
          const communityLink: string = getCommunityLink(
            `/c/${community.fullName}`
          );
          shareLink({
            link: communityLink,
            title: community.name,
          });
        }
      }
    );
  };
  return <HeaderIconButton icon={<IconDots />} onPress={onPress} />;
}
