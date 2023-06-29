import React, { useEffect } from "react";
import { LocalSite, Site, SiteAggregates } from "lemmy-js-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, HStack, Text, useTheme, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { IconDoorEnter, IconUserPlus } from "tabler-icons-react-native";

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
    <VStack backgroundColor={theme.colors.app.bg} flex={1} p={6}>
      <VStack
        backgroundColor={theme.colors.app.fg}
        p={3}
        borderRadius={10}
        space={4}
      >
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
            onPress={() => navigation.push("CreateAccount")}
            mt="auto"
            borderRadius="15"
            py={2.5}
            width="50%"
          >
            <HStack space={2} alignItems="center">
              <IconDoorEnter size={24} color="white" />

              <Text fontWeight="semibold" fontSize="lg">
                Join
              </Text>
            </HStack>
          </Button>
          <Button
            size="lg"
            colorScheme="lightBlue"
            onPress={() => navigation.push("CreateAccount")}
            mt="auto"
            borderRadius="15"
            py={2.5}
            flexGrow={1}
          >
            <HStack space={2} alignItems="center">
              <IconDoorEnter size={24} color="white" />

              <Text fontWeight="semibold" fontSize="lg">
                Login
              </Text>
            </HStack>
          </Button>
        </HStack>
        <Text>{site.description}</Text>
      </VStack>
    </VStack>
  );
}

export default InstanceScreen;
