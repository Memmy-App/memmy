import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, Text, VStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
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
  const theme = useAppSelector(selectThemeOptions);

  const instanceItem = ({ item }: { item: GetSiteResponse }) => (
    <InstanceItem site={item} />
  );

  const header = () => (
    <VStack my="$6" mx="$6">
      <Text
        size="md"
        color={theme.colors.textSecondary}
        fontStyle="italic"
        textAlign="center"
        pb="$2"
      >
        {t("onboarding.hubDiscovery.alreadyHaveServer")}
      </Text>
      <HStack space="lg">
        <Button
          size="lg"
          variant="solid"
          action="primary"
          onPress={() => navigation.push("CreateAccount")}
          mt="auto"
          borderRadius="$2xl"
          flexGrow={1}
        >
          <HStack space="sm" alignItems="center">
            <IconDoorEnter size={24} color="white" />

            <Text fontWeight="semibold" size="lg">
              {t("Join")}
            </Text>
          </HStack>
        </Button>
        <Button
          size="lg"
          variant="solid"
          action="primary"
          onPress={() => navigation.push("AddAccount")}
          mt="auto"
          borderRadius="$2xl"
          flexGrow={1}
        >
          <HStack space="sm" alignItems="center">
            <IconUser size={24} color="white" />

            <Text fontWeight="semibold" size="lg">
              {t("Login")}
            </Text>
          </HStack>
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <VStack flex={1} backgroundColor={theme.colors.bg}>
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
