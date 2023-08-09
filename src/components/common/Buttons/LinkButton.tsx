import { HStack, Text, VStack } from "@src/components/common/Gluestack";
import React, { useCallback } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import FastImage from "@gkasdorf/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { Pressable } from "react-native";
import { ICON_MAP } from "../../../constants/IconMap";
import { openLink } from "../../../helpers/LinkHelper";
import SFIcon from "../icons/SFIcon";

interface LinkButtonProps {
  link: string;
  thumbnail?: string;
}

function LinkButton({ link, thumbnail }: LinkButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useThemeOptions();

  const onPress = useCallback(() => {
    openLink(link, navigation, theme.colors.bg);
  }, [link]);

  return (
    <Pressable onPress={onPress}>
      <VStack
        borderRadius="$md"
        backgroundColor={theme.colors.bg}
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
          space="sm"
          mx="$4"
          my="$2"
        >
          <SFIcon
            icon={ICON_MAP.LINK}
            color={theme.colors.textSecondary}
            size={14}
          />
          <Text
            color={theme.colors.textSecondary}
            numberOfLines={1}
            style={{ width: "90%" }}
          >
            {link}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default React.memo(LinkButton);
