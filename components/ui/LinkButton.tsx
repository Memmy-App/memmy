import React from "react";
import {
  ChevronRightIcon,
  HStack,
  Icon,
  Pressable,
  Spacer,
  Text,
} from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { openLink } from "../../helpers/LinkHelper";
import { truncateLink } from "../../helpers/TextHelper";

interface LinkButtonProps {
  link: string;
}

function LinkButton({ link }: LinkButtonProps) {
  const onPress = () => {
    openLink(link).then();
  };

  return (
    <Pressable onPress={onPress}>
      <HStack
        backgroundColor="screen.700"
        borderRadius={5}
        padding={4}
        flexDirection="row"
        alignItems="center"
        space={2}
        my={4}
        mx={5}
      >
        <Icon as={Ionicons} name="link" />
        <Spacer />
        <Text>{truncateLink(link)}</Text>
        <Spacer />
        <ChevronRightIcon />
      </HStack>
    </Pressable>
  );
}

export default LinkButton;
