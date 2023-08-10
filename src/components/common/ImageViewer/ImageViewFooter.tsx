import { HStack, View } from "@src/components/gluestack";
import React from "react";
import { onGenericHapticFeedback } from "@src/helpers/haptics/HapticFeedbackHelper";
import { saveImage } from "@src/helpers/image";
import { useShowToast } from "@src/state/toast/toastStore";
import { shareLink } from "@src/helpers/share";
import IconButtonWithText from "@src/components/common/Button/IconButtonWithText";
import { ICON_MAP } from "@src/types/constants/IconMap";

interface IProps {
  source: string;
}

function ImageViewFooter({ source }: IProps): React.JSX.Element {
  const showToast = useShowToast();

  const onSave = async () => {
    onGenericHapticFeedback();

    await saveImage(source);

    showToast({
      message: "Image saved.",
      duration: 1500,
      variant: "success",
    });
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
        <IconButtonWithText onPress={onSave} icon={ICON_MAP.DOWNLOAD} />
        <IconButtonWithText onPress={onShare} icon={ICON_MAP.SHARE} />
      </HStack>
    </View>
  );
}

export default ImageViewFooter;
// <IconShare2 size={38} color={theme.colors.textSecondary} />
