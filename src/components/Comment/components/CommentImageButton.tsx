import React from 'react';
import { StyleProp, StyleSheet } from 'react-native';
import { XStack } from 'tamagui';
import { ViewerImage } from 'expo-image-viewer';

interface IProps {
  source: string;
  content?: string;
}

function CommentImageButton({ source, content }: IProps): React.JSX.Element {
  return (
    <XStack hitSlop={3} borderRadius={10} m="$1" flexShrink={1}>
      <ViewerImage
        source={source}
        title={content}
        initialDimensions={{ width: 105, height: 105 }}
        recyclingKey={source}
        useInitialDimensions
        contentFit="cover"
        style={styles.image as StyleProp<any>}
        activityIndicatorSize="small"
      />
    </XStack>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
  },
});

export default React.memo(CommentImageButton);
