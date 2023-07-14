import { SortType } from "lemmy-js-client";
import React from "react";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import {
  feedSortOptions,
  sortTopOptions,
} from "../../../../types/FeedSortOptions";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";

interface Props {
  feed: UseFeed;
  onSortUpdate?: (key: SortType) => void;
}
function FeedSortButton({ feed, onSortUpdate }: Props) {
  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        feed.setSort(nativeEvent.actionKey as SortType);
        onSortUpdate?.(nativeEvent.actionKey as SortType);
      }}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          ...Object.entries(feedSortOptions).map(([key, value]) => {
            if (key === "TopAll") {
              return {
                menuTitle: value.display,
                icon: {
                  type: "IMAGE_SYSTEM",
                  imageValue: {
                    systemName: value.icon,
                  },
                },
                menuItems: [
                  ...Object.entries(sortTopOptions).map(
                    ([sortTopKey, sortTopValue]) => ({
                      actionKey: sortTopKey,
                      actionTitle: sortTopValue.display,
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: sortTopValue.icon,
                        },
                      },
                    })
                  ),
                ],
              };
            }
            return {
              actionKey: key,
              actionTitle: value.display,
              icon: {
                type: "IMAGE_SYSTEM",
                imageValue: {
                  systemName: value.icon,
                },
              },
            };
          }),
        ],
      }}
    >
      <HeaderIconButton
        icon={<SFIcon icon={SortIconType[feed.sort]} />}
        onPress={() => {}}
      />
    </ContextMenuButton>
  );
}

const SortIconType = {
  TopDay: sortTopOptions.TopDay.icon,
  TopWeek: sortTopOptions.TopWeek.icon,
  TopHour: sortTopOptions.TopHour.icon,
  TopSixHour: sortTopOptions.TopSixHour.icon,
  TopTwelveHour: sortTopOptions.TopTwelveHour.icon,
  TopMonth: sortTopOptions.TopMonth.icon,
  TopYear: sortTopOptions.TopYear.icon,
  TopAll: sortTopOptions.TopAll.icon,
  Hot: feedSortOptions.Hot.icon,
  Active: feedSortOptions.Active.icon,
  New: feedSortOptions.New.icon,
  MostComments: feedSortOptions.MostComments.icon,
};

export default FeedSortButton;
