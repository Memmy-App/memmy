import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Label from '@components/Common/Form/Label';
import { Globe, Key, User } from '@tamagui/lucide-icons';
import InputWrapper from '@components/Common/Form/InputWrapper';
import { Button } from '@components/Common/Button';
import { useLogin } from '@hooks/useLogin';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { ScrollView, Spacer } from 'tamagui';
import TextInput from '@components/Common/Form/TextInput';
import AppToast from '@components/Common/Toast/AppToast';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function AddAccountModal({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const [form, setForm] = useState({
    instance: '',
    username: '',
    password: '',
  });

  const login = useLogin();

  const onLoginPress = (): void => {
    void login.doLogin({
      username: form.username,
      password: form.password,
      instance: form.instance,
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

      <LoadingOverlay visible={login.loading} />
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
        <Label icon={<User size={12} />}>Username</Label>
        <TextInput
          placeholder="Username"
          onChangeText={(v) => {
            onFormChange('username', v);
          }}
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="username"
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
          autoComplete="current-password"
          borderRadius="$3"
        />
      </InputWrapper>
      <Spacer />
      <Button onPress={onLoginPress} disabled={login.loading}>
        Login
      </Button>
    </ScrollView>
  );
}
