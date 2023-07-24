import { CommunityModeratorView } from "lemmy-js-client";
import { VStack } from "native-base";
import React from "react";
import AvatarUsername from "../../../../common/AvatarUsername";

interface IProps {
  moderators: CommunityModeratorView[];
}

function ModeratorList({ moderators }: IProps) {
  return (
    <VStack space={1}>
      {moderators.map((moderator) => (
        <AvatarUsername
          creator={moderator.moderator}
          key={moderator.moderator.id}
          isMod
          showPill={false}
        />
      ))}
    </VStack>
  );
}

export default React.memo(ModeratorList);
