import {
  IconBookmark,
  IconDots,
  IconMapPin,
  IconWorld,
} from "tabler-icons-react-native";
import HeaderIconButton from "../buttons/HeaderIconButton";
import { useTheme } from "native-base";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useAppDispatch } from "../../../store";
import { trigger } from "react-native-haptic-feedback";
import { showToast } from "../../../slices/toast/toastSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { UseFeed } from "../../hooks/feeds/useFeed";
import { ListingType } from "lemmy-js-client";

export type Community = {
  id: number;
  name: string;
};

const ContextualMenuIconType = {
  All: <IconWorld />,
  Local: <IconMapPin />,
  Subscribed: <IconBookmark />,
};

interface Props {
  feed: UseFeed;
  community?: Community;
  onPress?: () => void;
}

export const FeedOverflowButton = ({ feed, community, onPress }: Props) => {
  if (community) {
    return <CommunityOverflowButton community={community} />;
  }

  return <MainFeedOverflowButton feed={feed} onPress={onPress} />;
};

const overflowOptions = {
  community: ["Block Community", "Cancel"],
  main: ["All", "Local", "Subscribed", "Cancel"],
};

const CommunityOverflowButton = ({
  community,
}: Required<Pick<Props, "community">>) => {
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
};

export const MainFeedOverflowButton = ({
  feed,
  onPress,
}: Omit<Props, "community">) => {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const _onPress = () => {
    const cancelButtonIndex = overflowOptions.main.length - 1;
    showActionSheetWithOptions(
      {
        options: overflowOptions.main,
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
};
