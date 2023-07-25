import React from "react";
import { Text, VStack } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
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
  const theme = useAppSelector(selectThemeOptions);

  return (
    <VStack flex={1} justifyContent="center" alignItems="center" {...rest}>
      <Text
        fontStyle="italic"
        color={theme.colors.textSecondary}
        textAlign="center"
      >
        {t(`noResult.${type}`)}
      </Text>
    </VStack>
  );
}

export default NoResultView;
