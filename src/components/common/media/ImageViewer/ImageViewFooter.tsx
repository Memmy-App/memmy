import { HStack, View } from "@src/components/common/Gluestack";
import React from "react";
import { useAppDispatch } from "@root/store";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { onGenericHapticFeedback } from "@src/helpers/HapticFeedbackHelpers";
import { saveImage } from "@src/helpers/ImageHelper";
import { showToast } from "@src/slices/toast/toastSlice";
import { shareLink } from "@src/helpers/ShareHelper";
import { ICON_MAP } from "@src/constants/IconMap";
import SFIcon from "../../icons/SFIcon";
import IconButtonWithText from "../../IconButtonWithText";

interface ImageViewFooterProps {
  source: string;
}

function ImageViewFooter({ source }: ImageViewFooterProps) {
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
    <View position="absolute" bottom="$0" width="100%" zIndex={2}>
      <HStack
        flex={1}
        mb="$10"
        mx="$10"
        space="sm"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButtonWithText
          onPressHandler={onSave}
          icon={
            <SFIcon
              icon={ICON_MAP.DOWNLOAD}
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

export default ImageViewFooter;
// <IconShare2 size={38} color={theme.colors.textSecondary} />
