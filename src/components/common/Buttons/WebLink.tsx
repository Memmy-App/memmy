import React from "react";
import { useTheme } from "native-base";
import { Pressable, Text } from "@components/common/Gluestack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { openLink } from "../../../helpers/LinkHelper";

interface WebLinkProps {
  href: string;
  children: React.ReactNode;
}

function WebLink({ href, children }: WebLinkProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  const onPress = () => {
    openLink(href, navigation, theme.colors.app.bg);
  };

  return (
    <Pressable onPress={onPress}>
      <Text color="blue.500" textDecorationLine="underline" fontSize="$md">
        {children}
      </Text>
    </Pressable>
  );
}

export default WebLink;
