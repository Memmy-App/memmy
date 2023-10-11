import React, { SetStateAction, useState } from 'react';
import { Modal } from 'react-native';
import ImageViewer from '@components/Common/ImageViewer/ImageViewer';

interface Dimensions {
  height: number;
  width: number;
}

interface IImageViewerProviderContext {
  source?: string;
  setSource: React.Dispatch<SetStateAction<string | undefined>> | undefined;

  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>> | undefined;

  dimensions: Dimensions;
  setDimensions?: React.Dispatch<SetStateAction<Dimensions>> | undefined;
}

const ImageViewerContext = React.createContext<IImageViewerProviderContext>({
  source: undefined,
  setSource: undefined,

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
  const imageViewer = useImageViewer();

  const [source, setSource] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  return (
    <ImageViewerContext.Provider
      value={{
        source,
        setSource,

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
