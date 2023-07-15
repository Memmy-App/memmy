import React from "react";
import { Text } from "native-base";
import AvatarUsername from "./AvatarUsername";

interface IProps {
  item: any;
}

function moderatorList({ item }: IProps) {
  return (
    <Text marginTop={4}>
      - <AvatarUsername creator={item} isMod />
    </Text>
  );
}

export default React.memo(moderatorList);
