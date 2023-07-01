import React from "react";
import {
  IconDots,
  IconHeart,
  IconMapPin,
  IconWorld,
} from "tabler-icons-react-native";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { trigger } from "react-native-haptic-feedback";
import { ListingType } from "lemmy-js-client";
import HeaderIconButton from "../buttons/HeaderIconButton";
import { useAppDispatch } from "../../../store";
import { showToast } from "../../../slices/toast/toastSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { UseFeed } from "../../hooks/feeds/useFeed";

export type Community = {
  id: number;
  name: string;
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
  community: ["Block Community", "Cancel"],
  main: ["All", "Local", "Subscribed", "Cancel"],
};

function CommunityOverflowButton({
  community,
}: Required<Pick<Props, "community">>) {
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

        trigger("impactMedium");
        dispatch(
          showToast({
            message: `Blocked ${community.name}`,
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
