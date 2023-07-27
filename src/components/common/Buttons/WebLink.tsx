import React from "react";
import { Pressable, Text } from "@src/components/common/Gluestack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { openLink } from "../../../helpers/LinkHelper";

interface WebLinkProps {
  href: string;
  children: React.ReactNode;
}

function WebLink({ href, children }: WebLinkProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useThemeOptions();

  const onPress = () => {
    openLink(href, navigation, theme.colors.bg);
  };

  return (
    <Pressable onPress={onPress}>
      <Text color="blue500" textDecorationLine="underline" size="md">
        {children}
      </Text>
    </Pressable>
  );
}

export default WebLink;
