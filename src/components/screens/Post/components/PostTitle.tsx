import { Text, useTheme } from "native-base";
import React from "react";
import { useRoute } from "@react-navigation/core";
import { useAppSelector } from "../../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { usePostTitle } from "../../../../stores/posts/postsStore";

function Title({ mt, mb }: { mt?: number; mb?: number }) {
  const { postKey } = useRoute<any>().params;
  const postTitle = usePostTitle(postKey);

  const theme = useTheme();
  const { fontWeightPostTitle } = useAppSelector(selectSettings);
  return (
    <Text
      mt={mt}
      mb={mb}
      mx={4}
      fontSize="lg"
      fontWeight={fontWeightPostTitle}
      color={theme.colors.app.textPrimary}
    >
      {postTitle}
    </Text>
  );
}

export default React.memo(Title);
