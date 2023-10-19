import React, { useCallback, useRef } from 'react';
import { useNewPostScreen } from '@components/NewPost/hooks/useNewPostScreen';
import { ScrollView, View } from 'tamagui';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import VStack from '@components/Common/Stack/VStack';
import TextInput from '@components/Common/Form/TextInput';
import NsfwButton from '@components/Common/Button/NsfwButton';
import HStack from '@components/Common/Stack/HStack';
import { Languages } from '@tamagui/lucide-icons';
import LanguagePicker from '@components/Common/LanguagePicker/LanguagePicker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { useSiteLanguages } from '@src/state/site/siteStore';
import { ScrollView as RNScrollView } from 'react-native';

export default function NewPostScreen(): React.JSX.Element {
  const newPostScreen = useNewPostScreen();

  const pickerHeight = useSharedValue(0);
  const pickerOpacity = useSharedValue(0);

  const languages = useSiteLanguages();

  const viewRef = useRef<RNScrollView>();

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

  const onLayout = useCallback(() => {
    viewRef.current?.scrollToEnd();
  }, []);

  return (
    <>
      <ScrollView
        flex={1}
        backgroundColor="$fg"
        automaticallyAdjustKeyboardInsets={true}
        // @ts-expect-error valid ref
        ref={viewRef}
      >
        <LoadingOverlay visible={newPostScreen.isLoading} />
        <VStack marginBottom="$2" marginTop="$2" paddingHorizontal="$3">
          <HStack alignItems="center">
            <NsfwButton
              nsfw={newPostScreen.nsfw}
              setNsfw={newPostScreen.setNsfw}
            />
            <View marginLeft="auto">
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
          </HStack>
          <Animated.View style={[pickerStyle]}>
            <LanguagePicker
              selected={newPostScreen.languageId}
              setSelected={newPostScreen.setLanguageId}
            />
          </Animated.View>

          <TextInput
            onChangeText={newPostScreen.setTitle}
            placeholder="Title"
            fontSize="$5"
            // @ts-expect-error - valid
            ref={newPostScreen.inputRef}
            paddingHorizontal={0}
            marginTop={5}
            marginBottom={-5}
          />
          <TextInput
            onChangeText={newPostScreen.setUrl}
            placeholder="Link (optional)"
            fontSize="$3"
            // @ts-expect-error - valid
            ref={newPostScreen.inputRef}
            paddingHorizontal={0}
            marginVertical={-5}
            clearButtonMode="always"
          />
          <TextInput
            inputAccessoryViewID="accessory"
            onSelectionChange={newPostScreen.onSelectionChange}
            onChangeText={newPostScreen.setText}
            fontSize={16}
            // @ts-expect-error - This is valid shut up
            ref={newPostScreen.inputRef}
            multiline={true}
            scrollEnabled={false}
            paddingHorizontal={0}
            minHeight={200}
            onLayout={onLayout}
            marginTop={-5}
            placeholder="Have anything to say?"
          />
        </VStack>
      </ScrollView>
      <KeyboardAccessoryView
        text={newPostScreen.text}
        setText={newPostScreen.setText}
        selection={newPostScreen.selection}
        inputRef={newPostScreen.inputRef}
      />
    </>
  );
}
