import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VStack from '@components/Common/Stack/VStack';
import TextInput from '@components/Common/Form/TextInput';
import Label from '@components/Common/Form/Label';
import { Globe, Key, User } from '@tamagui/lucide-icons';
import InputWrapper from '@components/Common/Form/InputWrapper';
import { Button } from '@components/Common/Button';
import { useLogin } from '@hooks/useLogin';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { Spacer } from 'tamagui';

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
    <VStack space="$1" marginHorizontal="$3" marginVertical="$2">
      <LoadingOverlay visible={login.status.loading} />
      <InputWrapper>
        <Label icon={<Globe size={12} />}>Instance</Label>
        <TextInput
          size="$3"
          placeholder="Instance"
          onChangeText={(v) => {
            onFormChange('instance', v);
          }}
          autoCorrect={false}
          autoCapitalize="none"
          inputMode="url"
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
        />
      </InputWrapper>
      <Spacer />
      <Button onPress={onLoginPress} disabled={login.status.loading}>
        Login
      </Button>
    </VStack>
  );
}
