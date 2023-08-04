import React from "react";
import { HStack, View } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { ICON_MAP } from "../../../../constants/IconMap";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { saveImage } from "../../../../helpers/ImageHelper";
import { shareLink } from "../../../../helpers/ShareHelper";
import IconButtonWithText from "../../IconButtonWithText";
import SFIcon from "../../icons/SFIcon";
import { useAppDispatch } from "../../../../../store";
import { showToast } from "../../../../slices/toast/toastSlice";

interface VideoViewFooterProps {
  source: string;
}

function VideoViewFooter({ source }: VideoViewFooterProps) {
  const theme = useThemeOptions();
  const dispatch = useAppDispatch();

  const onSave = async () => {
    onGenericHapticFeedback();

    await saveImage(source);

    dispatch(
      showToast({
        message: "Image saved.",
        duration: 1500,
        variant: "success",
      })
    );
  };

  const onShare = async () => {
    try {
      await shareLink({
        link: source,
        isImage: true,
      });
    } catch (e) {
      /* Empty */
    }
  };

  return (
    <View position="absolute" bottom={0} width="100%" zIndex={2}>
      <HStack
        flex={1}
        mb={10}
        mx={10}
        space="sm"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButtonWithText
          onPressHandler={onSave}
          icon={
            <SFIcon
              icon="square.and.arrow.down"
              color={theme.colors.textSecondary}
              size={20}
            />
          }
        />
        <IconButtonWithText
          onPressHandler={onShare}
          icon={
            <SFIcon
              icon={ICON_MAP.SHARE}
              color={theme.colors.textSecondary}
              size={20}
            />
          }
        />
      </HStack>
    </View>
  );
}

export default VideoViewFooter;
// <IconShare2 size={38} color={theme.colors.app.textSecondary} />
