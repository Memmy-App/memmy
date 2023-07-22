import React from "react";
import { Text, VStack } from "@components/common/Gluestack";
import { CommunityModeratorView } from "lemmy-js-client";
import AvatarUsername from "./AvatarUsername";

interface IProps {
  moderators: CommunityModeratorView[];
}

function ModeratorList({ moderators }: IProps) {
  return (
    <VStack space="xs">
      <Text fontSize="$xl" fontWeight="bold">
        Mods:
      </Text>
      {moderators.map((moderator) => (
        <AvatarUsername creator={moderator.moderator} isMod />
      ))}
    </VStack>
  );
}

export default React.memo(ModeratorList);
