import React, { useCallback, useRef } from 'react';
import { INavigationProps } from '@src/types';
import { ScrollView, YStack } from 'tamagui';
import AppToast from '@components/Common/Toast/AppToast';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import TextInput from '@components/Common/Form/TextInput';
import KeyboardAccessoryView from '@components/Common/Keyboard/KeyboardAccesoryView';
import { useEditReplyScreen } from '@components/Reply/hooks/useEditReplyScreen';
import { ScrollView as RNScrollView } from 'react-native';

export default function EditReplyScreen({
  navigation,
  route,
}: INavigationProps): React.JSX.Element {
  const editReplyScreen = useEditReplyScreen();

  const viewRef = useRef<RNScrollView>();

  const onLayout = useCallback(() => {
    viewRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <>
      {/* @ts-expect-error - this is valid */}
      <ScrollView automaticallyAdjustKeyboardInsets={true} ref={viewRef}>
        <AppToast translate={100} />
        <LoadingOverlay visible={editReplyScreen.isLoading} />
        <YStack space="$2" mb="$2">
          <TextInput
            inputAccessoryViewID="accessory"
            onSelectionChange={editReplyScreen.onSelectionChange}
            onChangeText={editReplyScreen.setText}
            fontSize={16}
            ref={editReplyScreen.inputRef}
            autoFocus={true}
            multiline={true}
            scrollEnabled={false}
            onLayout={onLayout}
            placeholder="What do you want to say?"
          />
        </YStack>
      </ScrollView>
      <KeyboardAccessoryView
        text={editReplyScreen.text}
        setText={editReplyScreen.setText}
        selection={editReplyScreen.selection}
        inputRef={editReplyScreen.inputRef}
      />
    </>
  );
}
