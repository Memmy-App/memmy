import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VStack from '@components/Common/Stack/VStack';
import P1 from '@components/Common/Text/P1';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export default function CreateAccountModal({
  navigation,
  route,
}: IProps): React.JSX.Element {
  return (
    <VStack>
      <P1>Hello!</P1>
    </VStack>
  );
}
