import React from 'react';
import { useNewPostScreen } from '@components/NewPost/hooks/useNewPostScreen';
import { View, XStack, YStack } from 'tamagui';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import TextInput from '@components/Common/Form/TextInput';
import NsfwButton from '@components/Common/Button/NsfwButton';
import { Camera, Languages } from '@tamagui/lucide-icons';
import LanguagePicker from '@components/Common/LanguagePicker/LanguagePicker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { useSiteLanguages } from '@src/state';
import AppToast from '@components/Common/Toast/AppToast';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function NewPostScreen(): React.JSX.Element {
  const newPostScreen = useNewPostScreen();

  const pickerHeight = useSharedValue(0);
  const pickerOpacity = useSharedValue(0);

  const languages = useSiteLanguages();

  const pickerStyle = useAnimatedStyle(() => ({
    height: pickerHeight.value,
    opacity: pickerOpacity.value,
  }));

  const onLanguagePress = (): void => {
    'worklet';

    pickerHeight.value = withTiming(pickerHeight.value === 0 ? 200 : 0, {
      duration: 200,
    });
    pickerOpacity.value = withTiming(pickerOpacity.value === 0 ? 1 : 0, {
      duration: 200,
    });
  };

  return (
    <YStack backgroundColor="$fg" flex={1}>
      <KeyboardAwareScrollView automaticallyAdjustKeyboardInsets={true}>
        <LoadingOverlay
          visible={newPostScreen.isLoading || newPostScreen.isUploading}
        />
        <AppToast translate={100} />
        <YStack mb="$2" mt="$2" px="$3">
          <XStack alignItems="center">
            <NsfwButton
              nsfw={newPostScreen.nsfw}
              setNsfw={newPostScreen.setNsfw}
            />
            <View ml="auto">
              <ButtonOne
                label={
                  languages == null ||
                  languages[newPostScreen.languageId].name === 'Undetermined'
                    ? 'Language'
                    : languages[newPostScreen.languageId].name
                }
                width={130}
                icon={Languages}
                onPress={onLanguagePress}
              />
            </View>
          </XStack>
          <Animated.View style={[pickerStyle]}>
            <LanguagePicker
              selected={newPostScreen.languageId}
              setSelected={newPostScreen.setLanguageId}
            />
          </Animated.View>

          <YStack space="$2">
            <TextInput
              onChangeText={newPostScreen.setTitle}
              placeholder="Title"
              fontSize="$6"
              // @ts-expect-error - valid
              ref={newPostScreen.inputRef}
              px={0}
              mt={5}
              mb={-5}
              defaultValue={newPostScreen.title}
            />
            <XStack alignItems="center">
              <TextInput
                onChangeText={newPostScreen.setUrl}
                placeholder="Link (optional)"
                fontSize="$5"
                // @ts-expect-error - valid
                ref={newPostScreen.inputRef}
                px={0}
                my={-5}
                defaultValue={newPostScreen.url}
                keyboardType="url"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <AnimatedIconButton
                onPress={newPostScreen.onUploadImagePress}
                icon={Camera}
                iconSize={26}
                color="$accent"
                floatRight
              />
            </XStack>
            <TextInput
              inputAccessoryViewID="accessory"
              onSelectionChange={newPostScreen.onSelectionChange}
              onChangeText={newPostScreen.setText}
              fontSize="$3"
              // @ts-expect-error - This is valid shut up
              ref={newPostScreen.inputRef}
              multiline={true}
              scrollEnabled={false}
              px={0}
              height="100%"
              mt={-5}
              placeholder="Have anything to say?"
              defaultValue={newPostScreen.text}
            />
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
      <KeyboardAccessoryView
        text={newPostScreen.text}
        setText={newPostScreen.setText}
        selection={newPostScreen.selection}
        inputRef={newPostScreen.inputRef}
      />
    </YStack>
  );
}
