import React from "react";
import { Pressable, VStack } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

interface IProps {
  children: React.ReactNode;
  depth: number;
  onCommentPress: () => void;
}

function CommentWrapper({ children, depth, onCommentPress }: IProps) {
  const theme = useAppSelector(selectThemeOptions);

  return (
    <Pressable onPress={onCommentPress}>
      <VStack
        flex={1}
        pr="$2"
        space="sm"
        backgroundColor={theme.colors.fg}
        style={{
          paddingLeft: depth * 8,
        }}
        py="$1"
      >
        <VStack
          borderLeftWidth={depth > 2 ? 2 : 0}
          borderLeftColor={
            theme.colors.comments[depth - 2] ?? theme.colors.comments[5]
          }
          borderTopLeftRadius={1}
          borderBottomLeftRadius={1}
          pl={depth > 2 ? "$2" : "$0"}
          mt="$0"
        >
          {children}
        </VStack>
      </VStack>
    </Pressable>
  );
}

export default React.memo(CommentWrapper);
