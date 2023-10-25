import React from 'react';
import { Modal } from 'react-native';
import { Spinner, View } from 'tamagui';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';
import { useMouseLoadingIcon } from '@src/state';

interface IProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: IProps): React.JSX.Element {
  const mouse = useMouseLoadingIcon();

  return (
    <Modal visible={visible} transparent={true}>
      <View
        zIndex={9}
        backgroundColor="rgba(0,0,0,0.8)"
        position="absolute"
        width="100%"
        height="100%"
        top={0}
        left={0}
        alignItems="center"
        justifyContent="center"
      >
        {mouse ? (
          <LoadingAnimation size="normal" />
        ) : (
          <Spinner color="$accent" size="large" />
        )}
      </View>
    </Modal>
  );
}
