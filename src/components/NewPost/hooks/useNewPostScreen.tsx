import { ITextSelection, useLoadData } from '@src/hooks';
import {
  Alert,
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
  DraftState,
  getPostDraft,
  setNewPostId,
  useCommunityDefaultLanguage,
  useCurrentAccount,
  useDefaultLanguage,
  usePostBody,
  usePostLanguageId,
  usePostLink,
  usePostNsfw,
  usePostTitle,
  useSettingsStore,
  useSiteDefaultLanguage,
} from '@src/state';
import HeaderButton from '@components/Common/Button/HeaderButton';
import { PostResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import { updatePost } from '@src/state/post/actions/updatePost';
import { selectImage, uploadImage } from '@helpers/image';

interface UseNewPostScreen {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;

  nsfw: boolean;
  setNsfw: React.Dispatch<React.SetStateAction<boolean>>;

  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;

  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;

  languageId: number;
  setLanguageId: React.Dispatch<React.SetStateAction<number>>;

  selection: ITextSelection;
  inputRef: React.MutableRefObject<TextInput | undefined>;

  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;

  isLoading: boolean;

  onUploadImagePress: () => Promise<void>;

  isUploading: boolean;
}

export const useNewPostScreen = (): UseNewPostScreen => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { communityId, postId } = route.params;

  const useImgur = useSettingsStore((state) => state.useImgur);

  // Get the possible language options
  const userLanguage = useDefaultLanguage();
  const communityLanguage = useCommunityDefaultLanguage(communityId);
  const siteLanguage = useSiteDefaultLanguage();

  const account = useCurrentAccount();

  // We will get the current data if it exists
  const postContent = postId != null ? usePostBody(postId) : undefined;
  const postTitle = postId != null ? usePostTitle(postId) : undefined;
  const postNsfw = postId != null ? usePostNsfw(postId) : undefined;
  const postLink = postId != null ? usePostLink(postId) : undefined;
  const postLanguage = postId != null ? usePostLanguageId(postId) : undefined;

  const { isLoading, refresh: submit } = useLoadData<
    PostResponse | undefined
  >();

  const [text, setText] = useState(postContent ?? '');
  const [title, setTitle] = useState(postTitle ?? '');
  const [url, setUrl] = useState(postLink ?? '');
  const [nsfw, setNsfw] = useState<boolean>(postNsfw ?? false);
  const [languageId, setLanguageId] = useState(
    postLanguage ?? userLanguage ?? communityLanguage ?? siteLanguage ?? 0,
  );
  const [isUploading, setIsUploading] = useState(false);

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

    if (draft != null && postId == null) {
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
  }, [text, title, url, nsfw]);

  const beforeRemove = (): void => {
    if (text !== '' && saveDraft.current && postId == null) {
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
      // We have to just edit the post if the post ID is not null
      if (postId != null) {
        const res = await instance.editPost({
          post_id: postId,
          name: title,
          body: text !== '' ? text : undefined,
          url: url !== '' ? url : undefined,
          nsfw,
          language_id: languageId,
        });

        updatePost(res.post_view);

        navigation.pop();

        return;
      }

      const res = await instance.createPost({
        community_id: communityId,
        name: title,
        body: text !== '' ? text : undefined,
        url: url !== '' ? url : undefined,
        nsfw,
        language_id: languageId,
      });

      saveDraft.current = false;

      setNewPostId(res?.post_view.post.id);
      deletePostDraft(communityId, account!);

      navigation.pop();

      return res;
    });
  };

  const onUploadImagePress = useCallback(async (forceImgur = false) => {
    try {
      const imageUri = await selectImage();

      if (imageUri == null) return;

      setIsUploading(true);

      const res = await uploadImage(imageUri, useImgur || forceImgur);

      setIsUploading(false);

      setUrl(res ?? '');
    } catch (e) {
      setIsUploading(false);
      Alert.alert('Error', 'There was an error uploading the image.', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Try Again',
          onPress: () => {
            void onUploadImagePress();
          },
        },
        {
          text: `Try Using ${!useImgur ? 'Imgur' : 'Your Instance'}`,
          onPress: () => {
            void onUploadImagePress(!useImgur);
          },
        },
      ]);
    }
  }, []);

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

    title,
    setTitle,

    url,
    setUrl,

    languageId,
    setLanguageId,

    selection,
    onSelectionChange,

    inputRef,

    isLoading,

    onUploadImagePress,

    isUploading,
  };
};
