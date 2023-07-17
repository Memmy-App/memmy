import React from "react";
import { HStack, useTheme, View } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { IconDeviceFloppy, IconShare2 } from "tabler-icons-react-native";
import IconButtonWithText from "../IconButtonWithText";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { shareLink } from "../../../helpers/ShareHelper";
import { saveImage } from "../../../helpers/ImageHelper";

interface ImageViewFooterProps {
  source: string;
}

function ImageViewFooter({ source }: ImageViewFooterProps) {
  const theme = useTheme();

  const onSave = async () => {
    onGenericHapticFeedback();

    await saveImage(source);
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
        space={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButtonWithText
          onPressHandler={onSave}
          icon={
            <IconDeviceFloppy
              size={38}
              color={theme.colors.app.textSecondary}
            />
          }
        />
        <IconButtonWithText
          onPressHandler={onShare}
          icon={<IconShare2 size={38} color={theme.colors.app.textSecondary} />}
        />
      </HStack>
    </View>
  );
}

export default ImageViewFooter;
