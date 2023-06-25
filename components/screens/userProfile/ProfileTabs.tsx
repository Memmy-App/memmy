import React from "react";
import { HStack } from "native-base";
import ButtonGroup from "../../ui/buttons/ButtonGroup";
import GroupButton from "../../ui/buttons/GroupButton";

function ProfileTabs({
  selected,
  onCommentsPress,
  onPostsPress,
}: {
  selected: string;
  onCommentsPress: () => Promise<void>;
  onPostsPress: () => Promise<void>;
}) {
  return (
    <HStack>
      <ButtonGroup>
        <GroupButton
          onPress={onCommentsPress}
          text="Comments"
          selected={selected === "comments"}
        />
        <GroupButton
          onPress={onPostsPress}
          text="Posts"
          selected={selected === "posts"}
        />
      </ButtonGroup>
    </HStack>
  );
}

export default ProfileTabs;
