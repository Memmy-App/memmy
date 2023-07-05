import { HStack, Pressable, Text, useTheme, VStack } from "native-base";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { IconUnlink } from "tabler-icons-react-native";
import { openLink } from "../../../helpers/LinkHelper";
import { truncateLink } from "../../../helpers/TextHelper";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../store";

interface LinkButtonProps {
  link: string;
  thumbnail?: string;
}

function LinkButton({ link, thumbnail }: LinkButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();
  const currentAccount = useAppSelector(selectCurrentAccount);

  const onPress = () => {
    openLink(link, navigation, currentAccount.instance);
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

        <HStack flexDirection="row" alignItems="center" space={3} mx={4} my={2}>
          <IconUnlink color={theme.colors.app.textSecondary} />
          <Text color={theme.colors.app.textSecondary}>
            {truncateLink(link)}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default LinkButton;
