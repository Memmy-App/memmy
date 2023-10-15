import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePostBody } from '@src/state/post/postStore';
import { useCommentContent } from '@src/state/comment/commentStore';
import { ScrollView, Text } from 'tamagui';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function ReplyScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { postId, commentId } = route.params;

  const post = usePostBody(postId);
  const comment = useCommentContent(commentId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: comment != null ? 'Replying to Comment' : 'Replying to Post',
    });
  }, [post, comment]);

  return (
    <ScrollView flex={1}>
      <Text>Hello!</Text>
    </ScrollView>
  );
}
