import React from "react";
import { Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface LinkProps {
  screen: string;
  params: object;
  children: React.ReactNode;
}

function Link({ screen, params, children }: LinkProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = () => {
    navigation.push(screen, params);
  };

  return (
    <Pressable onPress={onPress} hitSlop={5}>
      {children}
    </Pressable>
  );
}

export default Link;
