import { HStack, useTheme, Text } from "native-base";
import { IconClockHour5 } from "tabler-icons-react-native";
import CommunityLink from "../../CommunityLink";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";
import { PostView } from "lemmy-js-client";

interface Props {
  post: PostView;
}

export const DateLine = ({ post }: Props) => {
  const theme = useTheme();

  return (
    <HStack alignItems="center" space={1}>
      <IconClockHour5 size={16} color={theme.colors.app.textSecondary} />
      <Text color={theme.colors.app.textSecondary}>
        {timeFromNowShort(post.post.published)}
      </Text>
      <CommunityLink
        community={post.community}
        color={theme.colors.app.textSecondary}
      />
    </HStack>
  );
};
