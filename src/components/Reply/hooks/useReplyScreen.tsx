import {
  addOrUpdateDraft,
  deleteCommentDraft,
  DraftState,
  getCommentDraft,
  setNewCommentId,
  setUnread,
  useCommentPostId,
  useCurrentAccount,
} from '@src/state';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ITextSelection, useLoadData } from '@src/hooks';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommentResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import HeaderButton from '@components/Common/Button/HeaderButton';
import { setReplyRead } from '@src/state/inbox/actions';

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

export const useReplyScreen = (isEdit = false): UseReplyScreen => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { postId, commentId, replyId } = route.params;

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
  const saveDraft = useRef(true);

  useEffect(() => {
    const draft = getCommentDraft({
      forPost: postId,
      forComment: commentId,
      account: account!,
    });

    navigation.setOptions({
      headerTitle:
        type === 'comment' || replyId != null
          ? 'Replying to Comment'
          : 'Replying to Post',
      headerLeft: () => (
        <HeaderButton
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
      headerRight: () => (
        <HeaderButton title="Submit" onPress={onSubmitPress} />
      ),
    });

    return unsubsribe;
  }, [navigation, text]);

  const beforeRemove = (): void => {
    if (text !== '' && saveDraft.current) {
      const newDraft: DraftState = {
        forPost: postId,
        forComment: commentId,
        content: text,
        account: account!,
      };
      addOrUpdateDraft(newDraft);
    }
  };

  const onSubmitPress = (): void => {
    submit(async () => {
      const res = await instance.createComment(
        postId ?? commentPostId,
        text,
        commentId,
      );

      saveDraft.current = false;

      setNewCommentId(res.comment_view.comment.id);
      deleteCommentDraft(postId, account!, commentId);

      // If this is an inbox reply we should update the reply store
      if (replyId !== null) {
        setReplyRead(replyId);
        setUnread(true);
      }

      navigation.pop();

      return res;
    });
  };

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
