import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { useTheme } from "native-base";
import { LinkInfo } from "../../../helpers/LinkHelper";
import { MinimalLinkPreview } from "./MinimalLinkPreview";
import { FullLinkPreview } from "./FullLinkPreview";

function LinkPreviewContainer({
  linkInfo,
  size,
}: {
  linkInfo: LinkInfo;
  size?: "full" | "minimal";
}) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  return useMemo(
    () => (
      <LinkPreview
        text={linkInfo.link}
        containerStyle={{
          backgroundColor: theme.colors.app.bg,
          borderRadius: 8,
          overflow: "hidden",
        }}
        renderLinkPreview={(data) => {
          if (size === "minimal") {
            return (
              <MinimalLinkPreview
                link={linkInfo.link}
                thumbnailUrl={data?.previewData?.image?.url}
                navigation={navigation}
                color={theme.colors.app.textSecondary}
              />
            );
          }

          return (
            <FullLinkPreview
              link={linkInfo.link}
              data={data}
              navigation={navigation}
              color={theme.colors.app.textSecondary}
            />
          );
        }}
      />
    ),
    [linkInfo.link]
  );
}

export default LinkPreviewContainer;
