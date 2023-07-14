import React, { MutableRefObject, useState } from "react";
import EnhancedImageViewing from "@gkasdorf/react-native-image-viewing";
import { Pressable, useTheme } from "native-base";
import { ResizeMode } from "react-native-fast-image";
import MemoizedFastImage from "../MemoizedFastImage";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import ImageViewFooter from "./ImageViewFooter";

interface IProps {
  sourceIndex?: number;
  sources: string[];
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

interface IImageSource {
  uri: string;
}

function ImageViewer({
  sourceIndex = 0,
  sources,
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

  const footer = (imageIndex) => <ImageViewFooter source={sources[imageIndex]} />;

  const sourceUris: IImageSource[] = sources.map((source) => ({ uri: source }));

  const viewer = (
    <EnhancedImageViewing
      images={sourceUris}
      imageIndex={sourceIndex}
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
          source={sources[sourceIndex]}
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
