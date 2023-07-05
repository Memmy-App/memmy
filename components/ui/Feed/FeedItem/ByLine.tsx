import React from "react";
import { HStack, useTheme } from "native-base";
import { Person } from "lemmy-js-client";
import AvatarUsername from "../../common/avatarUsername/AvatarUsername";
import FeaturedIndicator from "../../common/FeaturedIndicator";
import { IconBookCheck } from "../../customIcons/IconBookCheck";

interface Props {
  creator: Person;
  read: boolean;
  featured: boolean;
}

export function ByLine({ creator, read, featured }: Props) {
  const theme = useTheme();
  return (
    <HStack space={2} alignItems="center">
      <AvatarUsername creator={creator} />
      {read && <IconBookCheck color={theme.colors.app.info} size={20} />}
      <FeaturedIndicator featured={featured} />
    </HStack>
  );
}

export default {
  ByLine: React.memo(ByLine),
};
