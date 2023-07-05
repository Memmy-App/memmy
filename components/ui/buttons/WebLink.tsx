import React from "react";
import { Pressable, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { openLink } from "../../../helpers/LinkHelper";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../store";

interface WebLinkProps {
  href: string;
  children: React.ReactNode;
}

function WebLink({ href, children }: WebLinkProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const currentAccount = useAppSelector(selectCurrentAccount);

  const onPress = () => {
    openLink(href, navigation, currentAccount.instance);
  };

  return (
    <Pressable onPress={onPress}>
      <Text color="blue.500" underline fontSize="md">
        {children}
      </Text>
    </Pressable>
  );
}

export default WebLink;
