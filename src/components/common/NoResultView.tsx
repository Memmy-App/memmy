import React from "react";
import { Text, useTheme, VStack } from "native-base";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
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

export interface INoResultViewProps extends InterfaceVStackProps {
  type?: MessageType;
}

function NoResultView({ type = "default", ...rest }: INoResultViewProps) {
  const theme = useTheme();
  const { t } = useTranslation();

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
