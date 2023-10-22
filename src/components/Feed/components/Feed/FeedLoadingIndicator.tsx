import React from 'react';
import { Spinner, Text, YStack } from 'tamagui';
import ButtonOne from '@components/Common/Button/ButtonOne';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';
import { useMouseLoadingIcon } from '@src/state';

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
  const mouse = useMouseLoadingIcon();

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
      {mouse ? (
        <LoadingAnimation size="small" />
      ) : (
        <Spinner color="$accent" size="small" />
      )}
    </YStack>
  );
}

export default React.memo(FeedLoadingIndicator);
