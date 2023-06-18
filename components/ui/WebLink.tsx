import React from "react";
import { Pressable, Text } from "native-base";
import { openLink } from "../../helpers/LinkHelper";

interface WebLinkProps {
  href: string;
  children: React.ReactNode;
}

function WebLink({ href, children }: WebLinkProps) {
  const onPress = () => {
    openLink(href);
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
