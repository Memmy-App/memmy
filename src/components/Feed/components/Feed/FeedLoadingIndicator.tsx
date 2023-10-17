import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { Text } from 'tamagui';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';

interface IProps {
  loading: boolean;
  error?: boolean;
  retry?: () => unknown;
}

function FeedLoadingIndicator({
  loading,
  error,
  retry,
}: IProps): React.JSX.Element | null {
  if (!loading) {
    if (error != null && error) {
      return (
        <VStack
          flex={1}
          space="$2"
          alignItems="center"
          justifyContent="center"
          padding="$3"
        >
          <Text color="$secondary">Something went wrong</Text>
          {retry != null && <ButtonOne label="Retry" onPress={retry} />}
        </VStack>
      );
    }

    return null;
  }

  return (
    <VStack flex={1} alignItems="center" justifyContent="center" padding="$3">
      <LoadingAnimation size="small" />
    </VStack>
  );
}

export default React.memo(FeedLoadingIndicator);
