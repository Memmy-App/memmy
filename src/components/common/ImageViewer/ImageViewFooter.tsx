import React, { useState } from "react";
import { HStack, useTheme } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { IconDeviceFloppy, IconShare2 } from "tabler-icons-react-native";
import DialogContainer from "react-native-dialog/lib/Container";
import DialogDescription from "react-native-dialog/lib/Description";
import IconButtonWithText from "../IconButtonWithText";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import downloadAndSaveImage from "../../../helpers/ImageHelper";
import { shareLink } from "../../../helpers/ShareHelper";

interface ImageViewFooterProps {
  source: string;
}

function ImageViewFooter({ source }: ImageViewFooterProps) {
  const [downloading, setDownloading] = useState(false);

  const theme = useTheme();

  const onSave = async () => {
    onGenericHapticFeedback();
    setDownloading(true);
    await downloadAndSaveImage(source);
    setDownloading(false);
  };

  const onShare = async () => {
    setDownloading(true);
    await shareLink({
      link: source,
      isImage: true,
      callback: () => setDownloading(false),
    });
  };

  return (
    <>
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
      <DialogContainer visible={downloading}>
        <DialogDescription>Downloading image...</DialogDescription>
      </DialogContainer>
    </>
  );
}

export default ImageViewFooter;
