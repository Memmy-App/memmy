import { Box, HStack, Pressable, Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import SFIcon from "../icons/SFIcon";

function SpoilerContainer({ title, node }: { title: string; node: any }) {
  const { colors } = useAppSelector(selectThemeOptions);
  const [showSpoiler, setShowSpoiler] = React.useState(false);

  // this is unfortunately the only way right now I could figure out how to access just the text of the content
  // children is passed in as a weird View with Text and marginBottom: 10
  const content =
    node?.children[0]?.children[0]?.children[0]?.content ||
    "For some reason Memmy can't render this spoiler.";

  const onPress = () => setShowSpoiler(!showSpoiler);
  return (
    <Pressable onPress={onPress} hitSlop={5}>
      <HStack alignItems="center">
        {showSpoiler ? (
          <SFIcon color={colors.textPrimary} icon="chevron.down" size={8} />
        ) : (
          <SFIcon color={colors.textPrimary} icon="chevron.right" size={8} />
        )}

        <Text color={colors.textPrimary} fontWeight="bold">
          {title}
        </Text>
      </HStack>
      {showSpoiler && (
        <Box>
          <Text color={colors.textPrimary}>{content}</Text>
        </Box>
      )}
    </Pressable>
  );
}

export default SpoilerContainer;
