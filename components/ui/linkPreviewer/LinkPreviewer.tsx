import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { HStack, Pressable, Text, VStack, View, useTheme } from "native-base";
import FastImage from "react-native-fast-image";
import { IconLink } from "tabler-icons-react-native";
import { LinkInfo, openLink } from "../../../helpers/LinkHelper";
import { truncateLink } from "../../../helpers/TextHelper";
import LinkButton from "../buttons/LinkButton";

function LinkTitle({ title }: { title?: string }) {
  if (!title) {
    return false;
  }

  return <Text marginX={4}>{title}</Text>;
}

function LinkDescription({ description }: { description?: string }) {
  const theme = useTheme();

  if (!description) {
    return false;
  }

  return (
    <Text marginX={4} mb={4} color={theme.colors.app.textSecondary}>
      {description}
    </Text>
  );
}

function LinkPreviewContainer({ linkInfo }: { linkInfo: LinkInfo }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleContainerLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      setContainerWidth(event.nativeEvent.layout.width);
    },
    []
  );

  return (
    <LinkPreview
      text={linkInfo.link}
      containerStyle={{
        backgroundColor: theme.colors.app.bg,
        borderRadius: 8,
      }}
      renderLinkPreview={(data) => {
        if (
          !data.previewData?.image &&
          !data.previewData?.title &&
          !data.previewData?.description
        ) {
          return <LinkButton link={linkInfo.link} />;
        }

        return (
          <Pressable
            onPress={() => {
              openLink(linkInfo.link, navigation);
            }}
          >
            {data.previewData && (
              <View onLayout={handleContainerLayout}>
                <VStack mt={4}>
                  <LinkTitle title={data.previewData.title} />
                  <LinkDescription description={data.previewData.description} />

                  {data.previewData?.image && (
                    <FastImage
                      resizeMode="cover"
                      style={{
                        width: containerWidth,
                        height: containerWidth / data.aspectRatio,
                      }}
                      source={{
                        uri: data.previewData?.image.url,
                      }}
                    />
                  )}

                  {linkInfo.link && (
                    <HStack
                      flexDirection="row"
                      alignItems="center"
                      space={3}
                      mx={4}
                      my={2}
                    >
                      <IconLink color={theme.colors.app.textSecondary} />
                      <Text color={theme.colors.app.textSecondary}>
                        {truncateLink(linkInfo.link)}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </View>
            )}
          </Pressable>
        );
      }}
    />
  );
}

export default LinkPreviewContainer;
/*


      touchableWithoutFeedbackProps={{
        onPress: () => {
          openLink(linkInfo.link, navigation);
        },
      }}
*/
