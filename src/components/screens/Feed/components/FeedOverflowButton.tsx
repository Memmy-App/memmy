import React from "react";
import {
  IconDots,
  IconHeart,
  IconMapPin,
  IconWorld,
} from "tabler-icons-react-native";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ListingType } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../store";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { showToast } from "../../../../slices/toast/toastSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../../LemmyInstance";
import { writeToLog } from "../../../../helpers/LogHelper";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { shareLink } from "../../../../helpers/ShareHelper";
import { getCommunityLink } from "../../../../helpers/LinkHelper";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";

export type Community = {
  id: number;
  name: string;
  fullName: string;
};

const ContextualMenuIconType = {
  All: <IconWorld />,
  Local: <IconMapPin />,
  Subscribed: <IconHeart />,
};

interface Props {
  feed: UseFeed;
  community?: Community;
  onPress?: () => void;
}

export function FeedOverflowButton({ feed, community, onPress }: Props) {
  if (community) {
    return <CommunityOverflowButton community={community} />;
  }

  return <MainFeedOverflowButton feed={feed} onPress={onPress} />;
}

const overflowOptions = {
  community: ["Share", "Block Community", "Cancel"],
  main: ["All", "Local", "Subscribed", "Cancel"],
};

function CommunityOverflowButton({
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

export function MainFeedOverflowButton({
  feed,
  onPress,
}: Omit<Props, "community">) {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
  const _onPress = () => {
    const cancelButtonIndex = overflowOptions.main.length - 1;
    showActionSheetWithOptions(
      {
        options: overflowOptions.main.map((option) =>
          option === feed.listingType ? `${option} (current)` : option
        ),
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index) => {
        if (index === cancelButtonIndex) return;
        feed.setListingType(overflowOptions.main[index] as ListingType);
        onPress();
      }
    );
  };

  return (
    <HeaderIconButton
      icon={ContextualMenuIconType[feed.listingType]}
      onPress={_onPress}
    />
  );
}
