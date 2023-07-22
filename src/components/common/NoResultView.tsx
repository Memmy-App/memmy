import React from "react";
import { useTheme } from "native-base";
import { Text, VStack } from "@components/common/Gluestack";
import { useTranslation } from "react-i18next";

type MessageType =
  | "comments"
  | "posts"
  | "profileComments"
  | "profilePosts"
  | "profileSavedPosts"
  | "search"
  | "inbox"
  | "default";

export interface INoResultViewProps
  extends React.ComponentProps<typeof VStack> {
  type?: MessageType;
}

function NoResultView({ type = "default", ...rest }: INoResultViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <VStack flex={1} justifyContent="center" alignItems="center" {...rest}>
      <Text
        fontStyle="italic"
        color={theme.colors.app.textSecondary}
        textAlign="center"
      >
        {t(`noResult.${type}`)}
      </Text>
    </VStack>
  );
}

export default NoResultView;
