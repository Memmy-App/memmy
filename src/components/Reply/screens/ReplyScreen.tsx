import React, { useCallback, useRef } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, ScrollView } from 'tamagui';
import Comment from '@components/Comment/components/Comment';
import PostReplyContent from '@components/Post/components/PostReplyContent';
import VStack from '@components/Common/Stack/VStack';
import { ScrollView as RNScrollView } from 'react-native';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import { useReplyScreen } from '@components/Reply/hooks/useReplyScreen';
import { useThemeColorScheme } from '@src/hooks';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function ReplyScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { commentId, postId } = route.params;

  const replyScreen = useReplyScreen();
  const colorScheme = useThemeColorScheme();

  const viewRef = useRef<RNScrollView>();

  const onLayout = useCallback(() => {
    viewRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <>
      {/* @ts-expect-error - this is valid */}
      <ScrollView automaticallyAdjustKeyboardInsets={true} ref={viewRef}>
        <VStack space="$2" marginBottom="$2">
          {replyScreen.type === 'comment' ? (
            <Comment itemId={commentId} />
          ) : (
            <PostReplyContent itemId={postId} />
          )}
          <Input
            inputAccessoryViewID="accessory"
            onSelectionChange={replyScreen.onSelectionChange}
            onChangeText={replyScreen.setText}
            backgroundColor="$fg"
            borderWidth={0}
            borderRadius={0}
            fontSize={16}
            cursorColor="$accent"
            // @ts-expect-error - This is valid shut up
            ref={replyScreen.inputRef}
            autoFocus={true}
            multiline={true}
            keyboardAppearance={colorScheme}
            scrollEnabled={false}
            onLayout={onLayout}
            placeholder="What do you want to say?"
            placeholderTextColor="$secondary"
            color="$color"
          />
        </VStack>
      </ScrollView>
      <KeyboardAccessoryView
        text={replyScreen.text}
        setText={replyScreen.setText}
        selection={replyScreen.selection}
        inputRef={replyScreen.inputRef}
      />
    </>
  );
}
