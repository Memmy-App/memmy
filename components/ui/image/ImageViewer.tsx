import React, { MutableRefObject, useState } from "react";
import EnhancedImageViewing from "@gkasdorf/react-native-image-viewing";
import { Pressable, useTheme } from "native-base";
import { Share } from "react-native";
import MemoizedFastImage from "./MemoizedFastImage";
import { useAppSelector } from "../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import ImageViewFooter from "./ImageViewFooter";
import downloadAndSaveImage from "../../../helpers/ImageHelper";

interface IProps {
  source: string;
  nsfw: boolean;
  id?: number;
  recycled?: MutableRefObject<{}>;
  onlyViewer?: boolean;
}

function ImageViewer({ source, nsfw, id, recycled, onlyViewer }: IProps) {
  const [visible, setVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const { blurNsfw } = useAppSelector(selectSettings);
  const theme = useTheme();

  const onImagePress = () => setVisible(true);
  const onRequestClose = () => setVisible(false);

  const onImageLongPress = () => {};

  const onLoad = (e) => {
    setDimensions({ height: e.nativeEvent.height, width: e.nativeEvent.width });
  };

  const onSave = () => {
    downloadAndSaveImage(source);
  };

  const onShare = () => {
    Share.share({ url: source });
  };

  const footer = () => <ImageViewFooter onSave={onSave} onShare={onShare} />;

  const viewer = (
    <EnhancedImageViewing
      images={[{ uri: source }]}
      imageIndex={0}
      visible={visible}
      onRequestClose={onRequestClose}
      height={dimensions.height}
      width={dimensions.width}
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
        />
      </Pressable>
      {viewer}
    </>
  );
}

export default ImageViewer;
