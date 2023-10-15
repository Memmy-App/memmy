import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, ScrollView } from 'tamagui';
import Comment from '@components/Comment/components/Comment';
import PostReplyContent from '@components/Post/components/PostReplyContent';
import VStack from '@components/Common/Stack/VStack';
import { Dimensions } from 'react-native';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import { useReplyScreen } from '@components/Reply/hooks/useReplyScreen';

const { height: HEIGHT } = Dimensions.get('screen');

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

  return (
    <ScrollView flex={1} automaticallyAdjustKeyboardInsets={true}>
      <VStack space="$2">
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
          // @ts-expect-error - This is valid shut up
          ref={replyScreen.inputRef}
          multiline={true}
          height="100%"
        />
      </VStack>
      <KeyboardAccessoryView
        text={replyScreen.text}
        setText={replyScreen.setText}
        selection={replyScreen.selection}
        inputRef={replyScreen.inputRef}
      />
    </ScrollView>
  );
}
