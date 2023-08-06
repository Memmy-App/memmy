import { Text } from "@src/components/common/Gluestack";
import React from "react";
import { useRoute } from "@react-navigation/core";
import { usePostTitle } from "@src/stores/posts/postsStore";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import removeMd from "remove-markdown";

function Title({
  mt,
  mb,
}: {
  mt?: React.ComponentProps<typeof Text>["mt"];
  mb?: React.ComponentProps<typeof Text>["mb"];
}) {
  const { postKey } = useRoute<any>().params;
  const postTitle = usePostTitle(postKey);

  const theme = useThemeOptions();
  const fontWeightPostTitle = useSettingsStore(
    (state) => state.settings.fontWeightPostTitle
  );

  const newTitle = removeMd(postTitle);

  return (
    <Text
      mt={mt}
      mb={mb}
      mx="$4"
      size="lg"
      fontWeight={fontWeightPostTitle}
      color={theme.colors.textPrimary}
    >
      {newTitle}
    </Text>
  );
}

export default React.memo(Title);
