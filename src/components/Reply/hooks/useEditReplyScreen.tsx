import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { ITextSelection, useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { updateCommentContent, useCommentContent } from '@src/state';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderButton from '@components/Common/Button/HeaderButton';

interface UseEditReplyScreen {
  text: string;
  setText: React.Dispatch<SetStateAction<string>>;
  selection: ITextSelection;
  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;
  isLoading: boolean;
  inputRef: React.MutableRefObject<TextInput | undefined>;
}

export const useEditReplyScreen = (): UseEditReplyScreen => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { commentId } = useRoute<any>().params;

  const commentContent = useCommentContent(commentId);

  const [text, setText] = useState(commentContent ?? '');
  const [selection, setSelection] = useState<ITextSelection>({
    start: 0,
    end: 0,
  });

  const { isLoading, refresh: submit } = useLoadData();

  const inputRef = useRef<TextInput>();

  const onSubmitPress = (): void => {
    submit(async () => {
      await instance.editComment(commentId, text);

      updateCommentContent(commentId, text);

      navigation.pop();
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          title="Back"
          onPress={() => {
            navigation.pop();
          }}
        />
      ),
    });

    inputRef.current?.setNativeProps({
      text,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton title="Submit" onPress={onSubmitPress} />
      ),
    });
  }, [text]);

  return {
    text,
    setText,
    onSelectionChange,
    selection,
    isLoading,
    inputRef,
  };
};
