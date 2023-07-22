import { useTheme } from "native-base";
import { HStack, Pressable, Text, VStack } from "@components/common/Gluestack";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import FastImage from "@gkasdorf/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { openLink } from "../../../helpers/LinkHelper";
import { truncateLink } from "../../../helpers/TextHelper";
import SFIcon from "../icons/SFIcon";

interface LinkButtonProps {
  link: string;
  thumbnail?: string;
}

function LinkButton({ link, thumbnail }: LinkButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  const onPress = () => {
    openLink(link, navigation, theme.colors.app.bg);
  };

  return (
    <Pressable onPress={onPress}>
      <VStack
        borderRadius={5}
        backgroundColor={theme.colors.app.bg}
        justifyContent="flex-start"
      >
        {thumbnail && (
          <FastImage
            resizeMode="cover"
            style={{
              width: "100%",
              height: 172,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
            source={{
              uri: thumbnail,
            }}
          />
        )}

        <HStack
          flexDirection="row"
          alignItems="center"
          space="3"
          mx="$4"
          my="$2"
        >
          <SFIcon
            icon="link"
            color={theme.colors.app.textSecondary}
            size={14}
          />
          <Text color={theme.colors.app.textSecondary}>
            {truncateLink(link)}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default LinkButton;
