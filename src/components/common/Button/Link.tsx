import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, View } from "react-native";

interface IProps {
  screen: string;
  params: object;
  children: React.ReactNode;
  cancel?: boolean;
}

function Link({
  screen,
  params,
  children,
  cancel = false,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = () => {
    navigation.push(screen, params);
  };

  if (cancel) {
    return <View>{children}</View>;
  }

  return (
    <Pressable onPress={onPress} hitSlop={5}>
      {children}
    </Pressable>
  );
}

export default Link;
