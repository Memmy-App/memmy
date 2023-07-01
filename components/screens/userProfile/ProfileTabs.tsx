import React from "react";
import { HStack } from "native-base";
import ButtonGroup from "../../ui/buttons/ButtonGroup";
import GroupButton from "../../ui/buttons/GroupButton";

interface IProps {
  selected: string;
  onCommentsPress: () => void;
  onPostsPress: () => void;
  showSaved?: boolean;
  onSavedPostsPress?: () => void;
}

function ProfileTabs({
  selected,
  onCommentsPress,
  onPostsPress,
  showSaved = false,
  onSavedPostsPress,
}: IProps) {
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
        {showSaved && (
          <GroupButton
            onPress={onSavedPostsPress}
            text="Saved Posts"
            selected={selected === "savedposts"}
          />
        )}
      </ButtonGroup>
    </HStack>
  );
}

export default ProfileTabs;
