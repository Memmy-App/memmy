import { ListingType } from "lemmy-js-client";
import React from "react";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";

const optionIcons = {
  All: "globe",
  Local: "location",
  Subscribed: "heart",
};

const options: ListingType[] = ["All", "Local", "Subscribed"];

interface Props {
  feed: UseFeed;
  onPress?: () => void;
}

export function FeedTypeButton({ feed, onPress }: Props) {
  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        feed.setListingType(nativeEvent.actionKey as ListingType);
        onPress();
      }}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          ...options.map((option) => ({
            actionKey: option,
            actionTitle: option,
            menuState: feed.listingType === option ? "on" : "off",
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
      <HeaderIconButton
        icon={<SFIcon icon={optionIcons[feed.listingType]} />}
        onPress={() => {}}
      />
    </ContextMenuButton>
  );
}
