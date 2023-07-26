import {
  HStack,
  Pressable,
  Text,
  VStack,
} from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import FastImage from "@gkasdorf/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { openLink } from "../../../helpers/LinkHelper";
import { truncateLink } from "../../../helpers/TextHelper";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

interface LinkButtonProps {
  link: string;
  thumbnail?: string;
}

function LinkButton({ link, thumbnail }: LinkButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useAppSelector(selectThemeOptions);

  const onPress = () => {
    openLink(link, navigation, theme.colors.bg);
  };

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
          space="3"
          mx="$4"
          my="$2"
        >
          <SFIcon
            icon={ICON_MAP.LINK}
            color={theme.colors.textSecondary}
            size={14}
          />
          <Text color={theme.colors.textSecondary}>{truncateLink(link)}</Text>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default LinkButton;
