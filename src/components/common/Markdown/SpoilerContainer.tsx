import React from "react";
import { HStack, useTheme, Text, Pressable, Box } from "native-base";
import { IconChevronDown, IconChevronRight } from "tabler-icons-react-native";

function SpoilerContainer({ title, node }: { title: string; node: any }) {
  const { colors } = useTheme();
  const [showSpoiler, setShowSpoiler] = React.useState(false);

  // this is unfortunately the only way right now I could figure out how to access just the text of the content
  // children is passed in as a weird View with Text and marginBottom: 10
  const content =
    node.children[0].children[0].children[0].content ||
    "For some reason Memmy can't render this spoiler.";

  const onPress = () => setShowSpoiler(!showSpoiler);
  return (
    <Pressable onPress={onPress} hitSlop={5}>
      <HStack alignItems="center">
        {showSpoiler ? (
          <IconChevronDown color={colors.app.textPrimary} size={16} />
        ) : (
          <IconChevronRight color={colors.app.textPrimary} size={16} />
        )}

        <Text color={colors.app.textPrimary} bold>
          {title}
        </Text>
      </HStack>
      {showSpoiler && (
        <Box>
          <Text color={colors.app.textPrimary}>{content}</Text>
        </Box>
      )}
    </Pressable>
  );
}

export default SpoilerContainer;
