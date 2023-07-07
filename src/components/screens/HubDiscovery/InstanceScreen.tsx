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
} from "native-base";
import FastImage from "react-native-fast-image";
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
import MTable from "../../common/Table/MTable";
import MCell from "../../common/Table/MCell";
import { getBaseUrl } from "../../../helpers/LinkHelper";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function InstanceScreen({ route, navigation }: IProps) {
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
      <VStack p={3} borderRadius={10} space={4}>
        <HStack space={2}>
          <FastImage
            source={{ uri: site.icon }}
            style={{
              height: 68,
              width: 68,
              borderRadius: 100,
            }}
          />
          <VStack flex={1} mt="auto">
            <HStack space={1}>
              <IconUserPlus size={18} color={theme.colors.app.accent} />
              <Text color={theme.colors.app.textSecondary}>
                {counts.users.toLocaleString()} users
              </Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="semibold">
              {site.name}
            </Text>
          </VStack>
        </HStack>
        <HStack space="4">
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
            py={1.5}
            width="50%"
          >
            <HStack space={2} alignItems="center">
              <IconDoorEnter size={24} color="white" />

              <Text fontWeight="semibold" fontSize="md">
                Join
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
            borderRadius="15"
            py={1.5}
            flexGrow={1}
          >
            <HStack space={2} alignItems="center">
              <IconDoorEnter size={24} color="white" />

              <Text fontWeight="semibold" fontSize="md">
                Login
              </Text>
            </HStack>
          </Button>
        </HStack>
        <Text>{site.description}</Text>
      </VStack>
      <MTable header="Hub Info">
        <MCell
          title="Communities Allowed"
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
              ? "This hub doesn't allow user created communities."
              : "This hub allows user created communities."
          }
        />
        <MCell
          title="Federated"
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
              ? "This hub can't interact with other hubs."
              : "This hub can interact with other hubs."
          }
        />
        <MCell
          title="Downvotes Allowed"
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
              ? "This hub doesn't allow users to downvote."
              : "This hub allows users to downvote."
          }
        />
      </MTable>
      <MTable header="Other Info">
        <MCell
          title="Legal Info"
          icon={<IconHammer size={24} color={theme.colors.app.accent} />}
          subtitle={localSite.legal_information}
        />
      </MTable>
    </ScrollView>
  );
}

export default InstanceScreen;
