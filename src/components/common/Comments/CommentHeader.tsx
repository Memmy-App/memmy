import React from "react";
import { HStack, Text, useTheme } from "native-base";
import { IconChevronDown, IconDots } from "tabler-icons-react-native";
import { CommentAggregates, Person } from "lemmy-js-client";
import AvatarUsername from "../AvatarUsername";
import SmallVoteIcons from "../Vote/SmallVoteIcons";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import IconButtonWithText from "../IconButtonWithText";
import { timeFromNowShort } from "../../../helpers/TimeHelper";

interface IProps {
  creator: Person;
  counts: CommentAggregates;
  myVote: ILemmyVote;
  collapsed: boolean;
  published: string;
  opId: number;
  onButtonPress: () => unknown;
}

function CommentHeader({
  creator,
  counts,
  myVote,
  collapsed,
  published,
  opId,
  onButtonPress,
}: IProps) {
  const theme = useTheme();
  return (
    <HStack
      space={2}
      justifyContent="space-between"
      alignItems="center"
      mb={-3}
      pb={2}
    >
      <AvatarUsername creator={creator} opId={opId}>
        <SmallVoteIcons
          upvotes={counts.upvotes}
          downvotes={counts.downvotes}
          myVote={myVote}
        />
      </AvatarUsername>
      {!collapsed ? (
        <HStack alignItems="center" space={2}>
          <IconButtonWithText
            onPressHandler={onButtonPress}
            icon={<IconDots size={24} color={theme.colors.app.textSecondary} />}
          />
          <Text color={theme.colors.app.textSecondary}>
            {timeFromNowShort(published)}
          </Text>
        </HStack>
      ) : (
        <IconChevronDown size={24} color={theme.colors.app.textSecondary} />
      )}
    </HStack>
  );
}

export default React.memo(CommentHeader);
