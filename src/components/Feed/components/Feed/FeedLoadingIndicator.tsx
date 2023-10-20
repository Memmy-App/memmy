import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { Text } from 'tamagui';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';

interface IProps {
  loading: boolean;
  error?: boolean;
  retry?: () => unknown;
  empty?: boolean;
}

function FeedLoadingIndicator({
  loading,
  error,
  retry,
  empty,
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
          <Text fontSize="$2" color="$secondary">
            Something went wrong
          </Text>
          {retry != null && <ButtonOne label="Retry" onPress={retry} />}
        </VStack>
      );
    }

    if (empty === true) {
      return (
        <VStack
          flex={1}
          space="$2"
          alignItems="center"
          justifyContent="center"
          padding="$3"
        >
          <Text fontSize="$2" color="$secondary">
            Nothing to see here...
          </Text>
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
