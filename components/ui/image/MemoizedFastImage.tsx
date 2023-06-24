import React, { useMemo, useRef, useState } from "react";
import FastImage from "react-native-fast-image";
import { getRatio } from "../../../helpers/ImageHelper";

function MemoizedFastImage({ postId, source, recycled }) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const lastPostId = useRef(postId);

  if (postId !== lastPostId.current) {
    if (recycled.current[postId]) {
      setHeight(recycled.current[postId].height);
      setWidth(recycled.current[postId].width);
    }

    recycled.current = {
      ...recycled.current,
      [lastPostId.current]: {
        height,
        width,
      },
    };

    lastPostId.current = postId;
  }

  const onLoad = (e) => {
    if (height !== 0) return;

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
