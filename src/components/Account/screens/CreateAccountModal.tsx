import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Spacer, YStack } from 'tamagui';
import AppToast from '@components/Common/Toast/AppToast';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import InputWrapper from '@components/Common/Form/InputWrapper';
import Label from '@components/Common/Form/Label';
import {
  AtSign,
  Globe,
  Key,
  ShieldQuestion,
  User,
} from '@tamagui/lucide-icons';
import TextInput from '@components/Common/Form/TextInput';
import { Button } from '@components/Common/Button';
import { useSignup } from '@components/Account/hooks/useSignup';
import { Image } from 'expo-image';
import VerifyEmailNotice from '@components/Account/components/VerifyEmailNotice';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function CreateAccountModal({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const signup = useSignup();

  const [form, setForm] = useState({
    instance: '',
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
    captcha: '',
  });

  const onSignupPress = (): void => {
    void signup.doSignup({
      instance: form.instance,
      email: form.email,
      username: form.username,
      password: form.password,
      passwordAgain: form.passwordAgain,
      captchaUuid: signup.captchaUuid ?? '',
      captchaAnswer: form.captcha,
    });
  };

  const onFormChange = (key: string, value: string): void => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <ScrollView
      space="$1"
      marginHorizontal="$3"
      marginVertical="$2"
      automaticallyAdjustKeyboardInsets={true}
    >
      <AppToast translate={95} />
      <LoadingOverlay visible={signup.loading} />
      {signup.emailVerification ? (
        <VerifyEmailNotice signup={signup} doSignup={onSignupPress} />
      ) : (
        <>
          <InputWrapper>
            <Label icon={<Globe size={12} />}>Instance</Label>
            <TextInput
              placeholder="Instance"
              onChangeText={(v) => {
                onFormChange('instance', v);
              }}
              autoCorrect={false}
              autoCapitalize="none"
              inputMode="url"
              borderRadius="$3"
            />
          </InputWrapper>
          <InputWrapper>
            <Label icon={<AtSign size={12} />}>Email</Label>
            <TextInput
              placeholder="Email"
              onChangeText={(v) => {
                onFormChange('email', v);
              }}
              autoCorrect={false}
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              borderRadius="$3"
            />
          </InputWrapper>
          <InputWrapper>
            <Label icon={<User size={12} />}>Username</Label>
            <TextInput
              placeholder="Username"
              onChangeText={(v) => {
                onFormChange('username', v);
              }}
              autoCorrect={false}
              autoCapitalize="none"
              borderRadius="$3"
            />
          </InputWrapper>
          <InputWrapper>
            <Label icon={<Key size={12} />}>Password</Label>
            <TextInput
              placeholder="Password"
              onChangeText={(v) => {
                onFormChange('password', v);
              }}
              autoCorrect={false}
              secureTextEntry
              autoComplete="new-password"
              borderRadius="$3"
            />
          </InputWrapper>
          <InputWrapper>
            <Label icon={<Key size={12} />}>Password Again</Label>
            <TextInput
              placeholder="Password Again"
              onChangeText={(v) => {
                onFormChange('passwordAgain', v);
              }}
              autoCorrect={false}
              secureTextEntry
              autoComplete="new-password"
              borderRadius="$3"
            />
          </InputWrapper>

          {signup.captchaPng != null && (
            <>
              <YStack alignItems="center" marginTop="$3">
                <Image
                  source={{ uri: `data:image/png;base64,${signup.captchaPng}` }}
                  style={{ height: 100, width: '100%' }}
                />
              </YStack>
              <InputWrapper>
                <Label icon={<ShieldQuestion size={12} />}>Captcha</Label>
                <TextInput
                  placeholder="Captcha Answer"
                  onChangeText={(v) => {
                    onFormChange('captcha', v);
                  }}
                  autoCorrect={false}
                  autoComplete="off"
                  autoCapitalize="none"
                  borderRadius="$3"
                />
              </InputWrapper>
            </>
          )}
          <Spacer />
          <Button onPress={onSignupPress} disabled={signup.loading}>
            Sign Up
          </Button>
        </>
      )}
    </ScrollView>
  );
}
