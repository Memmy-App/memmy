import { Person } from "lemmy-js-client";
import { HStack } from "native-base";
import React from "react";
import AvatarUsername from "../../common/avatarUsername/AvatarUsername";

interface Props {
  creator: Person;
}

export function ByLine({ creator }: Props) {
  return (
    <HStack space={2} mx={4} alignItems="center">
      <AvatarUsername creator={creator} />
    </HStack>
  );
}

export default {
  ByLine: React.memo(ByLine),
};
