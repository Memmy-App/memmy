import { HStack, useTheme } from "native-base";
import IconButtonWithText from "../../common/IconButtonWithText";
import { IconBookmark } from "tabler-icons-react-native";
import VoteButton from "../../common/VoteButton";

interface Props {
  vote?: number;
  saved?: boolean;
  onSave: () => void;
  onVotePress: (vote: number) => void;
}
export const Actions = ({ vote, saved, onSave, onVotePress }: Props) => {
  const theme = useTheme();
  const upvoted = vote === 1;
  const downvoted = vote === -1;

  return (
    <HStack space={1} alignItems="center" justifyContent="flex-end">
      <IconButtonWithText
        icon={<IconBookmark size={25} color={theme.colors.app.textSecondary} />}
        iconBgColor={saved ? theme.colors.app.bookmark : theme.colors.app.fg}
        onPressHandler={onSave}
      />
      <VoteButton
        onPressHandler={() => onVotePress(1)}
        type="upvote"
        isVoted={upvoted}
      />
      <VoteButton
        onPressHandler={() => onVotePress(-1)}
        type="downvote"
        isVoted={downvoted}
      />
    </HStack>
  );
};
