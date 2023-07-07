import React, { MutableRefObject, useState } from "react";
import EnhancedImageViewing from "@gkasdorf/react-native-image-viewing";
import { Pressable, useTheme } from "native-base";
import { ResizeMode } from "react-native-fast-image";
import MemoizedFastImage from "./MemoizedFastImage";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import ImageViewFooter from "./ImageViewFooter";
import downloadAndSaveImage from "../../../helpers/ImageHelper";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { shareLink } from "../../../helpers/ShareHelper";

interface IProps {
  source: string;
  nsfw: boolean;
  id?: number;
  recycled?: MutableRefObject<{}>;
  onlyViewer?: boolean;
  resizeMode?: ResizeMode;
  height?: number;
  width?: number;
  visibleOverride?: boolean;
  onRequestCloseOverride?: () => void;
  heightOverride?: number;
  widthOverride?: number;
}

function ImageViewer({
  source,
  nsfw,
  id,
  recycled,
  onlyViewer,
  visibleOverride,
  resizeMode = "contain",
  height = undefined,
  width = undefined,
  onRequestCloseOverride,
  heightOverride,
  widthOverride,
}: IProps) {
  const [visible, setVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const { blurNsfw } = useAppSelector(selectSettings);
  const theme = useTheme();

  const onImagePress = () => setVisible(true);
  const onRequestClose = () => {
    if (onRequestCloseOverride) onRequestCloseOverride();
    else setVisible(false);
  };

  const onImageLongPress = () => {};

  const onLoad = (e) => {
    setDimensions({ height: e.nativeEvent.height, width: e.nativeEvent.width });
  };

  const onSave = async () => {
    onGenericHapticFeedback();

    await downloadAndSaveImage(source);
  };

  const onShare = () => {
    shareLink({ link: source, isImage: true });
  };

  const footer = () => <ImageViewFooter onSave={onSave} onShare={onShare} />;

  const viewer = (
    <EnhancedImageViewing
      images={[{ uri: source }]}
      imageIndex={0}
      visible={visibleOverride !== undefined ? visibleOverride : visible}
      onRequestClose={onRequestClose}
      height={heightOverride ?? dimensions.height}
      width={widthOverride ?? dimensions.width}
      FooterComponent={footer}
    />
  );

  if (onlyViewer) return viewer;

  return (
    <>
      <Pressable
        onPress={onImagePress}
        onLongPress={onImageLongPress}
        alignItems="center"
        justifyContent="center"
        backgroundColor={theme.colors.app.bg}
      >
        <MemoizedFastImage
          postId={id}
          source={source}
          recycled={recycled}
          nsfw={nsfw && blurNsfw}
          onLoad={onLoad}
          resizeMode={resizeMode}
          imgHeight={height}
          imgWidth={width}
        />
      </Pressable>
      {viewer}
    </>
  );
}

export default React.memo(ImageViewer);
