import React from 'react';
import { Text, YStack } from 'tamagui';
import ButtonOne from '@components/Common/Button/ButtonOne';
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
        <YStack
          flex={1}
          space="$2"
          alignItems="center"
          justifyContent="center"
          p="$3"
        >
          <Text fontSize="$2" color="$secondary">
            Something went wrong
          </Text>
          {retry != null && <ButtonOne label="Retry" onPress={retry} />}
        </YStack>
      );
    }

    if (empty === true) {
      return (
        <YStack
          flex={1}
          space="$2"
          alignItems="center"
          justifyContent="center"
          p="$3"
        >
          <Text fontSize="$2" color="$secondary">
            Nothing to see here...
          </Text>
        </YStack>
      );
    }

    return null;
  }

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" p="$3">
      <LoadingAnimation size="small" />
    </YStack>
  );
}

export default React.memo(FeedLoadingIndicator);
