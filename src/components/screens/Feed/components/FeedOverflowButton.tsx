import React, { useMemo } from "react";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import SFIcon from "../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../constants/IconMap";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";

export function FeedOverflowButton() {
  const { compactView } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onPress = (e: OnPressMenuItemEventObject) => {
    const key = e.nativeEvent.actionKey;

    if (key === "large" || key === "compact") {
      dispatch(setSetting({ compactView: !compactView }));
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
    <AppContextMenuButton
      options={options}
      selection={selection}
      onPressMenuItem={onPress}
    >
      <SFIcon icon={ICON_MAP.MORE_OPTIONS} />
    </AppContextMenuButton>
  );
}
