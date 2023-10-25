import React, { useCallback, useRef } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, YStack } from 'tamagui';
import Comment from '@components/Comment/components/Comment';
import PostReplyContent from '@components/Post/components/PostReplyContent';
import { ScrollView as RNScrollView } from 'react-native';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import { useReplyScreen } from '@components/Reply/hooks/useReplyScreen';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import InboxComment from '@components/Inbox/components/InboxComment';
import TextInput from '@components/Common/Form/TextInput';
import AppToast from '@components/Common/Toast/AppToast';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function ReplyScreen({ route }: IProps): React.JSX.Element {
  const { commentId, postId, replyId, mentionId, edit } = route.params;

  const replyScreen = useReplyScreen(edit);

  const viewRef = useRef<RNScrollView>();

  const onLayout = useCallback(() => {
    viewRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <>
      {/* @ts-expect-error - this is valid */}
      <ScrollView automaticallyAdjustKeyboardInsets={true} ref={viewRef}>
        <AppToast translate={100} />
        <LoadingOverlay visible={replyScreen.isLoading} />
        <YStack space="$2" mb="$2">
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          {(replyScreen.type === 'comment' && <Comment itemId={commentId} />) ||
            ((replyId != null || mentionId != null) && (
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              <InboxComment
                itemId={replyId ?? mentionId}
                type={replyId != null ? 'reply' : 'mention'}
              />
            )) || <PostReplyContent itemId={postId} />}
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
