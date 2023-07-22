import React from "react";
import { HStack } from "@components/common/Gluestack";

interface IProps {
  children: React.ReactNode;
}

function CommentHeaderWrapper({ children }: IProps) {
  return (
    <HStack
      space="sm"
      justifyContent="space-between"
      alignItems="center"
      mb={-3}
      pb="$2"
    >
      {children}
    </HStack>
  );
}

export default CommentHeaderWrapper;
