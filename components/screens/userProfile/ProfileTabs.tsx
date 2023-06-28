import React from "react";
import { HStack } from "native-base";
import ButtonGroup from "../../ui/buttons/ButtonGroup";
import GroupButton from "../../ui/buttons/GroupButton";

interface IProps {
  selected: string;
  onCommentsPress: () => void;
  onPostsPress: () => void;
}

function ProfileTabs({ selected, onCommentsPress, onPostsPress }: IProps) {
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
