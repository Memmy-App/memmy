import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "native-base";
import { Button, HStack, Text, VStack } from "@components/common/Gluestack";
import { FlashList } from "@shopify/flash-list";
import { GetSiteResponse } from "lemmy-js-client";
import { IconDoorEnter, IconUser } from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
import useHubDiscovery from "../../../../hooks/hubDiscovery/useHubDiscovery";
import InstanceItem from "../../HubDiscovery/components/InstanceItem";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function HubDiscoveryScreen({ navigation }: IProps) {
  const hub = useHubDiscovery();
  const { t } = useTranslation();
  const theme = useTheme();

  const instanceItem = ({ item }: { item: GetSiteResponse }) => (
    <InstanceItem site={item} />
  );

  const header = () => (
    <VStack my={6} mx={6}>
      <Text
        fontSize="$md"
        color={theme.colors.app.textSecondary}
        fontStyle="italic"
        textAlign="center"
        pb={2}
      >
        {t("onboarding.hubDiscovery.alreadyHaveServer")}
      </Text>
      <HStack space="4">
        <Button
          size="lg"
          colorScheme="lightBlue"
          onPress={() => navigation.push("CreateAccount")}
          mt="auto"
          borderRadius="$2xl"
          py={2.5}
          width="50%"
        >
          <HStack space="2" alignItems="center">
            <IconDoorEnter size={24} color="white" />

            <Text fontWeight="semibold" fontSize="$lg">
              {t("Join")}
            </Text>
          </HStack>
        </Button>
        <Button
          size="lg"
          colorScheme="lightBlue"
          onPress={() => navigation.push("AddAccount")}
          mt="auto"
          borderRadius="$2xl"
          py={2.5}
          flexGrow={1}
        >
          <HStack space="2" alignItems="center">
            <IconUser size={24} color="white" />

            <Text fontWeight="semibold" fontSize="$lg">
              {t("Login")}
            </Text>
          </HStack>
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <FlashList
        renderItem={instanceItem}
        data={hub.instances}
        ListHeaderComponent={header}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        estimatedItemSize={200}
      />
    </VStack>
  );
}

export default HubDiscoveryScreen;
