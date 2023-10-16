import { useCommentPostId } from '@src/state/comment/commentStore';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ITextSelection, useLoadData } from '@src/hooks';
import {
  Button,
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { EventArg, useNavigation, useRoute } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DraftState } from '@src/state/draft/draftStore';
import { addOrUpdateDraft, getCommentDraft } from '@src/state/draft/actions';
import { useCurrentAccount } from '@src/state/account/accountStore';
import { CommentResponse } from 'lemmy-js-client';
import instance from '@src/Instance';

interface UseReplyScreen {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;

  selection: ITextSelection;
  inputRef: React.MutableRefObject<TextInput | undefined>;

  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;

  type: 'post' | 'comment';

  isLoading: boolean;
}

interface IBackEventArgs {
  type: string;
  payload?: object | undefined;
  source?: string | undefined;
  target?: string | undefined;
}

interface IBackEvent {
  action: Readonly<IBackEventArgs>;
}

export const useReplyScreen = (isEdit = false): UseReplyScreen => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { postId, commentId } = route.params;

  const commentPostId = useCommentPostId(commentId);
  const account = useCurrentAccount();

  const { isLoading, refresh: submit } = useLoadData<CommentResponse>();

  const type = useMemo(
    () => (commentPostId != null ? 'comment' : 'post'),
    [commentPostId],
  );

  const [text, setText] = useState('');
  const [selection, setSelection] = useState<ITextSelection>({
    start: 0,
    end: 0,
  });

  const inputRef = useRef<TextInput>();

  useEffect(() => {
    const draft = getCommentDraft({
      forPost: postId,
      forComment: commentId,
      account: account!,
    });

    navigation.setOptions({
      headerTitle:
        type === 'comment' ? 'Replying to Comment' : 'Replying to Post',
      headerLeft: () => (
        <Button
          title="Back"
          onPress={() => {
            navigation.pop();
          }}
        />
      ),
    });

    if (draft != null) {
      setText(draft.content ?? '');
      inputRef.current?.setNativeProps({
        text: draft.content,
      });
    }
  }, []);

  useEffect(() => {
    const unsubsribe = navigation.addListener('beforeRemove', beforeRemove);

    navigation.setOptions({
      headerRight: () => <Button title="Submit" onPress={onSubmitPress} />,
    });

    return unsubsribe;
  }, [navigation, text]);

  const beforeRemove = (
    e: EventArg<'beforeRemove', true, IBackEvent>,
  ): void => {
    if (text !== '') {
      const newDraft: DraftState = {
        forPost: postId,
        forComment: commentId,
        content: text,
        account: account!,
      };
      addOrUpdateDraft(newDraft);
    }
  };

  const onSubmitPress = useCallback(() => {
    submit(async () => {
      const res = await instance.createComment(
        postId ?? commentPostId,
        text,
        commentId,
      );

      console.log(res);

      navigation.getParent()?.setParams({
        replyId: res.comment_view.comment.id,
      });
      navigation.pop();

      console.log('got here?');

      return res;
    });
  }, [text]);

  const onSelectionChange = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setSelection({
        start: e.nativeEvent.selection.start,
        end: e.nativeEvent.selection.end,
      });
    },
    [setSelection],
  );

  return {
    text,
    setText,
    selection,
    inputRef,
    onSelectionChange,
    type,
    isLoading,
  };
};
