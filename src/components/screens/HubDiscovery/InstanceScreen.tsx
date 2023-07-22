import React, { useEffect } from "react";
import { LocalSite, Site, SiteAggregates } from "lemmy-js-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Button,
  HStack,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from "@components/common/Gluestack";
import FastImage from "@gkasdorf/react-native-fast-image";
import {
  IconArrowDown,
  IconCheck,
  IconDoorEnter,
  IconHammer,
  IconHome,
  IconPlanet,
  IconUserPlus,
  IconX,
} from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
import MTable from "../../common/Table/MTable";
import MCell from "../../common/Table/MCell";
import { getBaseUrl } from "../../../helpers/LinkHelper";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function InstanceScreen({ route, navigation }: IProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const site = route.params.site as Site;
  const localSite = route.params.localSite as LocalSite;
  const counts = route.params.counts as SiteAggregates;

  useEffect(() => {
    navigation.setOptions({
      title: site.name,
    });
  }, []);

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1} p={6}>
      <VStack p="$3" borderRadius={10} space="lg">
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
              <IconUserPlus size={18} color={theme.colors.app.accent} />
              <Text color={theme.colors.app.textSecondary}>
                {counts.users.toLocaleString()} users
              </Text>
            </HStack>
            <Text fontSize="$2xl" fontWeight="semibold">
              {site.name}
            </Text>
          </VStack>
        </HStack>
        <HStack space="lg">
          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() =>
              navigation.push("CreateAccount", {
                server: getBaseUrl(site.actor_id),
              })
            }
            mt="auto"
            borderRadius="15"
            py="$1.5"
            width="50%"
          >
            <HStack space="sm" alignItems="center">
              <IconDoorEnter size={24} color="white" />

              <Text fontWeight="semibold" fontSize="$md">
                {t("Join")}
              </Text>
            </HStack>
          </Button>
          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() =>
              navigation.push("AddAccount", {
                server: getBaseUrl(site.actor_id),
              })
            }
            mt="auto"
            borderRadius="$2xl"
            py="$1.5"
            flexGrow={1}
          >
            <HStack space="sm" alignItems="center">
              <IconDoorEnter size={24} color="white" />

              <Text fontWeight="semibold" fontSize="$md">
                {t("Login")}
              </Text>
            </HStack>
          </Button>
        </HStack>
        <Text>{site.description}</Text>
      </VStack>
      <MTable header={t("Hub Info")}>
        <MCell
          title={t("Create Communities")}
          icon={<IconHome size={24} color={theme.colors.app.accent} />}
          rightAccessory={
            localSite.community_creation_admin_only ? (
              <IconX size={24} color={theme.colors.app.error} />
            ) : (
              <IconCheck size={24} color={theme.colors.app.success} />
            )
          }
          subtitle={
            localSite.community_creation_admin_only
              ? t("hubDiscovery.createCommunities.notAllowed")
              : t("hubDiscovery.createCommunities.allowed")
          }
        />
        <MCell
          title={t("Federated")}
          icon={<IconPlanet size={24} color={theme.colors.app.accent} />}
          rightAccessory={
            !localSite.federation_enabled ? (
              <IconX size={24} color={theme.colors.app.error} />
            ) : (
              <IconCheck size={24} color={theme.colors.app.success} />
            )
          }
          subtitle={
            !localSite.federation_enabled
              ? t("hubDiscovery.federated.notAllowed")
              : t("hubDiscovery.federated.allowed")
          }
        />
        <MCell
          title={t("hubDiscovery.downvote.title")}
          icon={<IconArrowDown size={24} color={theme.colors.app.accent} />}
          rightAccessory={
            !localSite.enable_downvotes ? (
              <IconX size={24} color={theme.colors.app.error} />
            ) : (
              <IconCheck size={24} color={theme.colors.app.success} />
            )
          }
          subtitle={
            !localSite.enable_downvotes
              ? t("hubDiscovery.downvote.notAllowed")
              : t("hubDiscovery.downvote.allowed")
          }
        />
      </MTable>
      <MTable header={t("Other Info")}>
        <MCell
          title={t("Legal Info")}
          icon={<IconHammer size={24} color={theme.colors.app.accent} />}
          subtitle={localSite.legal_information}
        />
      </MTable>
    </ScrollView>
  );
}

export default InstanceScreen;
