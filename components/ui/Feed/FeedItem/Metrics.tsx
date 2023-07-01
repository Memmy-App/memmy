import { PostAggregates } from "lemmy-js-client";
import { HStack, Text, useTheme } from "native-base";
import {
  IconArrowDown,
  IconArrowUp,
  IconMessage,
} from "tabler-icons-react-native";

interface Props {
  data: PostAggregates;
  vote?: number;
}

export const Metrics = ({ data, vote }: Props) => {
  const theme = useTheme();
  const upvoted = vote === 1;
  const downvoted = vote === -1;

  const upvoteColor = upvoted
    ? theme.colors.app.upvote
    : theme.colors.app.textSecondary;

  const downvoteColor = downvoted
    ? theme.colors.app.downvote
    : theme.colors.app.textSecondary;

  return (
    <HStack flex={1} space={1}>
      <HStack alignItems="center">
        <IconArrowUp color={upvoteColor} size={20} />
        <Text color={upvoteColor} fontSize="sm">
          {vote === 1 ? data.upvotes + 1 : data.upvotes}
        </Text>
      </HStack>
      <HStack alignItems="center">
        <IconArrowDown color={downvoteColor} size={20} />
        <Text color={downvoteColor} fontSize="sm">
          {vote === -1 ? data.downvotes + 1 : data.downvotes}
        </Text>
      </HStack>
      <HStack alignItems="center" ml={1} space={0.5}>
        <IconMessage color={theme.colors.app.textSecondary} size={20} />
        <Text color={theme.colors.app.textSecondary} fontSize="sm">
          {data.comments}
        </Text>
      </HStack>
    </HStack>
  );
};
