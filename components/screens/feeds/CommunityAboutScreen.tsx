import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, Text, useTheme, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import RenderMarkdown from "../../ui/markdown/RenderMarkdown";

function CommunityAboutScreen({ route }: { route: any }) {
  const theme = useTheme();

  return (
    <ScrollView flex={1} backgroundColor={theme.colors.app.backgroundPrimary}>
      <VStack>
        {route.params.banner && (
          <FastImage
            source={{
              uri: route.params.banner,
            }}
            style={{ height: 200, width: "100%", opacity: 0.5 }}
          />
        )}
        <VStack p={4}>
          <Text fontSize="2xl" fontWeight="bold" underline>
            Description
          </Text>
          <RenderMarkdown text={route.params.description} />
        </VStack>
      </VStack>
    </ScrollView>
  );
}

export default CommunityAboutScreen;
