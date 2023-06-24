import React, { useMemo, useRef, useState } from "react";
import FastImage from "react-native-fast-image";
import { getRatio } from "../../../helpers/ImageHelper";

function MemoizedFastImage({
  postId,
  source,
  recycled,
}: {
  postId: number;
  source: string;
  recycled?: React.MutableRefObject<{}> | undefined;
}) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const lastPostId = useRef(postId);

  if (recycled && postId !== lastPostId.current) {
    recycled.current = {
      ...recycled.current,
      [lastPostId.current]: {
        height,
        width,
      },
    };

    if (recycled.current[postId]) {
      setHeight(recycled.current[postId].height);
      setWidth(recycled.current[postId].width);
    }

    lastPostId.current = postId;
  }

  const onLoad = (e) => {
    const { imageHeight, imageWidth } = getRatio(
      e.nativeEvent.height,
      e.nativeEvent.width
    );

    setHeight(imageHeight);
    setWidth(imageWidth);
  };

  return useMemo(
    () => (
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: source,
        }}
        style={{
          height,
          width,
        }}
        onLoad={onLoad}
      />
    ),
    [height, source]
  );
}

export default MemoizedFastImage;
