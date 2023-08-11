import React from "react";
import { HStack } from "@src/components/common/Gluestack";

interface IProps {
  children: React.ReactNode;
}

function CommentHeaderWrapper({ children }: IProps) {
  return (
    <HStack space="sm" justifyContent="space-between" alignItems="center">
      {children}
    </HStack>
  );
}

export default CommentHeaderWrapper;
