import React, { useMemo } from "react";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import setSetting from "@src/stores/settings/actions/setSetting";
import SFIcon from "../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../constants/IconMap";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";
import { Box } from "../../../common/Gluestack";

export function FeedOverflowButton() {
  const compactView = useSettingsStore((state) => state.settings.compactView);
  const { t } = useTranslation();

  const onPress = (e: OnPressMenuItemEventObject) => {
    const key = e.nativeEvent.actionKey;

    if (key === "large" || key === "compact") {
      setSetting({ compactView: !compactView }).then();
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
