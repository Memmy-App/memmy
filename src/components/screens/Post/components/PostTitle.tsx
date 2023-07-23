import { Text } from "@components/common/Gluestack";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import { useRoute } from "@react-navigation/core";
import { usePostTitle } from "../../../../stores/posts/postsStore";

function Title({
  mt,
  mb,
}: {
  mt?: React.ComponentProps<typeof Text>["mt"];
  mb?: React.ComponentProps<typeof Text>["mb"];
}) {
  const { postKey } = useRoute<any>().params;
  const postTitle = usePostTitle(postKey);

  const theme = useAppSelector(selectThemeOptions);
  const { fontWeightPostTitle } = useAppSelector(selectSettings);
  return (
    <Text
      mt={mt}
      mb={mb}
      mx="$4"
      size="lg"
      fontWeight={fontWeightPostTitle}
      color={theme.colors.textPrimary}
    >
      {postTitle}
    </Text>
  );
}

export default React.memo(Title);
