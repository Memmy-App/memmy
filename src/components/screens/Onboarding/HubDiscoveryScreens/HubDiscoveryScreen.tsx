import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, Text, VStack } from "@src/components/gluestack";
import { FlashList } from "@shopify/flash-list";
import { GetSiteResponse } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import useHubDiscovery from "@src/hooks/hubDiscovery/useHubDiscovery";
import InstanceItem from "@src/components/screens/Onboarding/HubDiscoveryScreens/components/InstanceItem";
import { SFIcon } from "@src/components/common/icons/SFIcon";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function HubDiscoveryScreen({ navigation }: IProps): React.JSX.Element {
  const hub = useHubDiscovery();
  const { t } = useTranslation();
  const theme = useThemeOptions();

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
            <SFIcon icon="person.badge.plus" />

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
            <SFIcon icon="person.badge.key" />

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
