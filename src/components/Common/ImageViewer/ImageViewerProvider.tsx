import React, { SetStateAction, useState } from 'react';
import { Modal } from 'react-native';
import ImageViewer from '@components/Common/ImageViewer/ImageViewer';

interface Dimensions {
  height: number;
  width: number;
}

interface ImageViewerParams {
  source?: string;
  title?: string;
}

interface IImageViewerProviderContext {
  params?: ImageViewerParams;
  setParams:
    | React.Dispatch<SetStateAction<ImageViewerParams | undefined>>
    | undefined;

  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>> | undefined;

  dimensions: Dimensions;
  setDimensions?: React.Dispatch<SetStateAction<Dimensions>> | undefined;
}

const ImageViewerContext = React.createContext<IImageViewerProviderContext>({
  params: undefined,
  setParams: undefined,

  visible: false,
  setVisible: undefined,

  dimensions: { height: 0, width: 0 },
  setDimensions: undefined,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useImageViewer = () => React.useContext(ImageViewerContext);

interface IProps {
  children: React.ReactNode;
}

function ImageViewerProvider({ children }: IProps): React.JSX.Element {
  const [params, setParams] = useState<ImageViewerParams | undefined>({
    source: undefined,
    title: undefined,
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  return (
    <ImageViewerContext.Provider
      value={{
        params,
        setParams,

        visible,
        setVisible,

        dimensions,
        setDimensions,
      }}
    >
      <Modal visible={visible} transparent statusBarTranslucent>
        <ImageViewer />
      </Modal>
      {children}
    </ImageViewerContext.Provider>
  );
}

export default React.memo(ImageViewerProvider);
