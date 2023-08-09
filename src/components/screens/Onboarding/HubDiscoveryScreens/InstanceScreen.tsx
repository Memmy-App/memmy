import React, { useEffect } from "react";
import { LocalSite, Site, SiteAggregates } from "lemmy-js-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Button,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "@src/components/gluestack";
import FastImage from "@gkasdorf/react-native-fast-image";
import { useTranslation } from "react-i18next";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import Table from "@src/components/common/Table/Table";
import Cell from "@src/components/common/Table/Cell";
import { ICON_MAP } from "@src/types/constants/IconMap";
import getBaseUrl from "@src/helpers/links/getBaseUrl";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function InstanceScreen({ route, navigation }: IProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useThemeOptions();
  const site = route.params.site as Site;
  const localSite = route.params.localSite as LocalSite;
  const counts = route.params.counts as SiteAggregates;

  useEffect(() => {
    navigation.setOptions({
      title: site.name,
    });
  }, []);

  return (
    <ScrollView bg={theme.colors.bg} flex={1} p="$6">
      <VStack p="$3" borderRadius="$xl" space="lg">
        <HStack space="sm">
          <FastImage
            source={{ uri: site.icon }}
            style={{
              height: 68,
              width: 68,
              borderRadius: 100,
            }}
          />
          <VStack flex={1} mt="auto">
            <HStack space="xs">
              <SFIcon icon="person" />
              <Text color={theme.colors.textSecondary}>
                {counts.users.toLocaleString()} users
              </Text>
            </HStack>
            <Text size="2xl" fontWeight="semibold">
              {site.name}
            </Text>
          </VStack>
        </HStack>
        <HStack space="lg">
          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={() =>
              navigation.push("CreateAccount", {
                host: getBaseUrl(site.actor_id),
              })
            }
            mt="auto"
            borderRadius="$2xl"
            flexGrow={1}
          >
            <HStack space="sm" alignItems="center">
              <SFIcon
                icon="door.left.hand.open"
                color={theme.colors.textPrimary}
              />

              <Text fontWeight="semibold" size="md">
                {t("Join")}
              </Text>
            </HStack>
          </Button>
          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={() =>
              navigation.push("AddAccount", {
                host: getBaseUrl(site.actor_id),
              })
            }
            mt="auto"
            borderRadius="$2xl"
            flexGrow={1}
          >
            <HStack space="sm" alignItems="center">
              <SFIcon
                icon="door.left.hand.open"
                color={theme.colors.textPrimary}
              />

              <Text fontWeight="semibold" size="md">
                {t("Login")}
              </Text>
            </HStack>
          </Button>
        </HStack>
        <Text>{site.description}</Text>
      </VStack>
      <Table header={t("Hub Info")}>
        <Cell
          title={t("Create Communities")}
          icon={ICON_MAP.HOUSE}
          rightAccessory={
            localSite.community_creation_admin_only ? (
              <SFIcon icon={ICON_MAP.XMARK} />
            ) : (
              <SFIcon icon={ICON_MAP.CHECK} />
            )
          }
          subtitle={
            localSite.community_creation_admin_only
              ? t("hubDiscovery.createCommunities.notAllowed")
              : t("hubDiscovery.createCommunities.allowed")
          }
        />
        <Cell
          title={t("Federated")}
          icon={ICON_MAP.GLOBE}
          rightAccessory={
            !localSite.federation_enabled ? (
              <SFIcon icon={ICON_MAP.XMARK} />
            ) : (
              <SFIcon icon={ICON_MAP.CHECK} />
            )
          }
          subtitle={
            !localSite.federation_enabled
              ? t("hubDiscovery.federated.notAllowed")
              : t("hubDiscovery.federated.allowed")
          }
        />
        <Cell
          title={t("hubDiscovery.downvote.title")}
          icon={ICON_MAP.DOWNVOTE}
          rightAccessory={
            !localSite.enable_downvotes ? (
              <SFIcon icon={ICON_MAP.XMARK} />
            ) : (
              <SFIcon icon={ICON_MAP.CHECK} />
            )
          }
          subtitle={
            !localSite.enable_downvotes
              ? t("hubDiscovery.downvote.notAllowed")
              : t("hubDiscovery.downvote.allowed")
          }
        />
      </Table>
      <Table header={t("Other Info")}>
        <Cell
          title={t("Legal Info")}
          icon={ICON_MAP.HAMMER}
          subtitle={localSite.legal_information}
        />
      </Table>
    </ScrollView>
  );
}

export default InstanceScreen;
