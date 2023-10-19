import { ITextSelection, useLoadData } from '@src/hooks';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  addOrUpdateDraft,
  deletePostDraft,
  getPostDraft,
} from '@src/state/draft/actions';
import { useCurrentAccount } from '@src/state/account/accountStore';
import HeaderButton from '@components/Common/Button/HeaderButton';
import { DraftState } from '@src/state/draft/draftStore';
import { PostResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import {
  useDefaultLanguage,
  useSiteDefaultLanguage,
} from '@src/state/site/siteStore';
import { useCommunityDefaultLanguage } from '@src/state/community/communityStore';
import { setNewPostId } from '@src/state/app/actions';

interface UseNewPostScreen {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;

  nsfw: boolean;
  setNsfw: React.Dispatch<React.SetStateAction<boolean>>;

  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;

  languageId: number;
  setLanguageId: React.Dispatch<React.SetStateAction<number>>;

  selection: ITextSelection;
  inputRef: React.MutableRefObject<TextInput | undefined>;

  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;

  isLoading: boolean;
}

export const useNewPostScreen = (isEdit = false): UseNewPostScreen => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { communityId, postId } = route.params;

  const userLanguage = useDefaultLanguage();
  const communityLanguage = useCommunityDefaultLanguage(communityId);
  const siteLanguage = useSiteDefaultLanguage();

  const account = useCurrentAccount();

  const { isLoading, refresh: submit } = useLoadData<
    PostResponse | undefined
  >();

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [nsfw, setNsfw] = useState<boolean>(false);
  const [languageId, setLanguageId] = useState(
    userLanguage ?? communityLanguage ?? siteLanguage ?? 0,
  );

  const [selection, setSelection] = useState<ITextSelection>({
    start: 0,
    end: 0,
  });

  const inputRef = useRef<TextInput>();
  const saveDraft = useRef(true);

  useEffect(() => {
    const draft = getPostDraft({
      forCommunity: communityId,
      account: account!,
    });

    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          title="Back"
          onPress={() => {
            navigation.pop();
          }}
        />
      ),
      ...(postId != null && {
        headerTitle: 'Edit Post',
      }),
    });

    if (draft != null) {
      setText(draft.content ?? '');
      inputRef.current?.setNativeProps({
        text: draft.content,
      });
    }
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', beforeRemove);

    navigation.setOptions({
      headerRight: () => (
        <HeaderButton title="Submit" onPress={onSubmitPress} />
      ),
    });

    return unsubscribe;
  }, [text]);

  const beforeRemove = (): void => {
    if (text !== '' && saveDraft.current) {
      const newDraft: DraftState = {
        forCommunity: communityId,
        content: text,
        account: account!,
      };

      addOrUpdateDraft(newDraft);
    }
  };

  const onSubmitPress = (): void => {
    submit(async () => {
      const res = await instance.createPost({
        community_id: communityId,
        name: title,
        body: text !== '' ? text : undefined,
        url: url !== '' ? url : undefined,
        nsfw,
        language_id: languageId,
      });

      saveDraft.current = false;

      console.log(res);
      console.log(res?.post_view.post.id);

      setNewPostId(res?.post_view.post.id);
      deletePostDraft(communityId, account!);

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

    nsfw,
    setNsfw,

    setTitle,
    setUrl,

    languageId,
    setLanguageId,

    selection,
    onSelectionChange,

    inputRef,

    isLoading,
  };
};
