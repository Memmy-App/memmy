import React from "react";
import { GetSiteResponse } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { StyleSheet } from "react-native";
import {
  IconChevronRight,
  IconExclamationCircle,
  IconLockOpen,
  IconUserPlus,
} from "tabler-icons-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface IProps {
  site: GetSiteResponse;
}

function InstanceItem({ site }: IProps) {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = () =>
    navigation.push("Instance", {
      site: site.site_view.site,
      localSite: site.site_view.local_site,
      counts: site.site_view.counts,
    });

  return (
    <Pressable onPress={onPress}>
      <VStack
        backgroundColor={theme.colors.app.fg}
        mx={6}
        my={1.5}
        borderRadius={10}
        p={2}
        space={2}
      >
        <HStack>
          <HStack flex={1} alignItems="center" space={2}>
            <FastImage
              source={{ uri: site.site_view.site.icon }}
              style={styles.image}
            />
            <Text fontSize="md">{site.site_view.site.name}</Text>
            <View ml="auto">
              <IconChevronRight size={32} color={theme.colors.app.accent} />
            </View>
          </HStack>
        </HStack>
        <HStack>
          <Text>{site.site_view.site.description}</Text>
        </HStack>
        <HStack space={2} pt={1} alignItems="center">
          <HStack space={1}>
            <IconUserPlus size={18} color={theme.colors.app.accent} />
            <Text color={theme.colors.app.textSecondary}>
              {site.site_view.counts.users.toLocaleString()} users
            </Text>
          </HStack>
          {!site.site_view.local_site.federation_enabled && (
            <HStack space={1} alignItems="center">
              <IconExclamationCircle size={18} color={theme.colors.app.warn} />
              <Text color={theme.colors.app.warn}>Defederated</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode === "Closed" && (
            <HStack space={1} alignItems="center">
              <IconExclamationCircle size={18} color={theme.colors.app.warn} />
              <Text color={theme.colors.app.warn}>Registration Closed</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode ===
            "RequireApplication" && (
            <HStack space={1} alignItems="center">
              <IconExclamationCircle size={18} color={theme.colors.app.info} />
              <Text color={theme.colors.app.info}>Application Required</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode === "Open" && (
            <HStack space={1} alignItems="center">
              <IconLockOpen size={18} color={theme.colors.app.success} />
              <Text color={theme.colors.app.success}>Open Registration</Text>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 32,
    width: 32,
    borderRadius: 100,
  },
});

export default InstanceItem;
