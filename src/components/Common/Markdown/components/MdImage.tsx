import React, { useCallback, useState } from 'react';
import { Image, ImageLoadEventData } from 'expo-image';
import { IDimensions, MdToken } from '@src/types';

interface IProps {
  token: MdToken;
}

function MdImage({ token }: IProps): React.JSX.Element {
  const [dimensions, setDimensions] = useState<IDimensions>({
    height: 1,
    width: 1,
  });

  const onImageLoad = useCallback(
    (e: ImageLoadEventData) => {
      setDimensions({
        height: e.source.height,
        width: e.source.width,
      });
    },
    [token],
  );

  return (
    <Image
      source={{ uri: token.attrs[0][1] }}
      onLoad={onImageLoad}
      style={dimensions}
    />
  );
}

export default MdImage;
