import React, { useCallback, useRef } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, YStack } from 'tamagui';
import Comment from '@components/Comment/components/Comment';
import PostReplyContent from '@components/Post/components/PostReplyContent';
import { ScrollView as RNScrollView } from 'react-native';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import { useReplyScreen } from '@components/Reply/hooks/useReplyScreen';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import TextInput from '@components/Common/Form/TextInput';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function ReplyScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { commentId, postId, edit } = route.params;

  const replyScreen = useReplyScreen(edit);

  const viewRef = useRef<RNScrollView>();

  const onLayout = useCallback(() => {
    viewRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <>
      {/* @ts-expect-error - this is valid */}
      <ScrollView automaticallyAdjustKeyboardInsets={true} ref={viewRef}>
        <LoadingOverlay visible={replyScreen.isLoading} />
        <YStack space="$2" mb="$2">
          {replyScreen.type === 'comment' ? (
            <Comment itemId={commentId} />
          ) : (
            <PostReplyContent itemId={postId} />
          )}
          <TextInput
            inputAccessoryViewID="accessory"
            onSelectionChange={replyScreen.onSelectionChange}
            onChangeText={replyScreen.setText}
            fontSize={16}
            // @ts-expect-error - This is valid shut up
            ref={replyScreen.inputRef}
            autoFocus={true}
            multiline={true}
            scrollEnabled={false}
            onLayout={onLayout}
            placeholder="What do you want to say?"
          />
        </YStack>
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
