import { HStack, Pressable, Spacer, Text, VStack, useTheme } from "native-base";
import React, { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { IconUnlink } from "tabler-icons-react-native";
import { openLink } from "../../helpers/LinkHelper";
import { truncateLink } from "../../helpers/TextHelper";

interface LinkButtonProps {
  link: string;
  thumbnail: string;
}

function LinkButton({ link, thumbnail }: LinkButtonProps) {
  const [imgHeight, setImgHeight] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  const onPress = () => {
    openLink(link, navigation);
  };

  useEffect(() => {
    if (thumbnail) {
      Image.getSize(thumbnail, (width, height) => {
        const screenWidth = Dimensions.get("window").width;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImgHeight(imageHeight);
      });
    }
  }, [thumbnail]);

  return (
    <Pressable onPress={onPress}>
      <VStack
        borderRadius={5}
        my={4}
        mx={5}
        backgroundColor={theme.colors.app.backgroundTricondary}
        justifyContent="flex-start"
      >
        <FastImage
          style={{
            width: "100%",
            height: imgHeight,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
          source={{
            uri: thumbnail,
          }}
        />
        <HStack flexDirection="row" alignItems="center" space={2} mx={4} my={2}>
          <IconUnlink color={theme.colors.app.secondaryText} />
          <Spacer />
          <Text color={theme.colors.app.secondaryText}>
            {truncateLink(link)}
          </Text>
          <Spacer />
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default LinkButton;
