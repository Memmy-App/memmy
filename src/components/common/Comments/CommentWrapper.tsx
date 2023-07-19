import React, { useEffect } from "react";
import { Pressable, useTheme, VStack } from "native-base";

interface IProps {
  children: React.ReactNode;
  depth: number;
  onCommentPress: () => void;
}

function CommentWrapper({ children, depth, onCommentPress }: IProps) {
  const theme = useTheme();

  useEffect(() => {
    console.log("changed it");
  }, [children]);

  return (
    <Pressable onPress={onCommentPress}>
      <VStack
        flex={1}
        pr={2}
        space={2}
        backgroundColor={theme.colors.app.fg}
        style={{
          paddingLeft: depth * 8,
        }}
        py={1}
      >
        <VStack
          borderLeftWidth={depth > 2 ? 2 : 0}
          borderLeftColor={
            theme.colors.app.comments[depth - 2] ?? theme.colors.app.comments[5]
          }
          borderLeftRadius={1}
          pl={depth > 2 ? 2 : 0}
          mt={0}
        >
          {children}
        </VStack>
      </VStack>
    </Pressable>
  );
}

export default React.memo(CommentWrapper);
