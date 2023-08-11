import React, { useMemo } from "react";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import { Box } from "@src/components/gluestack";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { setSetting } from "@src/state/settings/actions";

export function FeedOverflowButton(): React.JSX.Element {
  const compactView = useSettingsStore((state) => state.compactView);
  const { t } = useTranslation();

  const onPress = (e: OnPressMenuItemEventObject) => {
    const key = e.nativeEvent.actionKey;

    if (key === "large" || key === "compact") {
      setSetting("compactView", !compactView);
    }
  };

  const selection = useMemo(
    () => (compactView ? "compact" : "large"),
    [compactView]
  );

  const options = useMemo(
    () => [
      {
        key: "size",
        title: t("Post Size"),
        options: [
          {
            key: "large",
            title: t("Large"),
            icon: ICON_MAP.POST_SIZE.LARGE,
          },
          {
            key: "compact",
            title: t("Compact"),
            icon: ICON_MAP.POST_SIZE.COMPACT,
          },
        ],
      },
    ],
    [t]
  );

  return (
    <Box paddingRight={10}>
      <AppContextMenuButton
        options={options}
        selection={selection}
        onPressMenuItem={onPress}
      >
        <SFIcon icon={ICON_MAP.MORE_OPTIONS} />
      </AppContextMenuButton>
    </Box>
  );
}
