import { CommunityModeratorView } from "lemmy-js-client";
import { VStack } from "@components/common/Gluestack";
import React from "react";
import AvatarUsername from "../../../../common/AvatarUsername";

interface IProps {
  moderators: CommunityModeratorView[];
}

function ModeratorList({ moderators }: IProps) {
  return (
    <VStack space="xs">
      {moderators.map((moderator) => (
        <AvatarUsername creator={moderator.moderator} isMod showPill={false} />
      ))}
    </VStack>
  );
}

export default React.memo(ModeratorList);
