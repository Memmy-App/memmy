import React from 'react';
import { Modal } from 'react-native';
import { View } from 'tamagui';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';

interface IProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: IProps): React.JSX.Element {
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
        <LoadingAnimation size="normal" />
      </View>
    </Modal>
  );
}
