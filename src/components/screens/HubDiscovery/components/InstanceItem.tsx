import React from "react";
import { GetSiteResponse } from "lemmy-js-client";
import { useTheme } from "native-base";
import {
  HStack,
  Pressable,
  Text,
  View,
  VStack,
} from "@components/common/Gluestack";
import FastImage from "@gkasdorf/react-native-fast-image";
import { StyleSheet } from "react-native";
import {
  IconChevronRight,
  IconExclamationCircle,
  IconLockOpen,
  IconUserPlus,
} from "tabler-icons-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

interface IProps {
  site: GetSiteResponse;
}

function InstanceItem({ site }: IProps) {
  const { t } = useTranslation();
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
        mx="$6"
        my={1.5}
        borderRadius="$xl"
        p="$2"
        space="sm"
      >
        <HStack>
          <HStack flex={1} alignItems="center" space="sm">
            <FastImage
              source={{ uri: site.site_view.site.icon }}
              style={styles.image}
            />
            <Text size="md">{site.site_view.site.name}</Text>
            <View ml="auto">
              <IconChevronRight size={32} color={theme.colors.app.accent} />
            </View>
          </HStack>
        </HStack>
        <HStack>
          <Text>{site.site_view.site.description}</Text>
        </HStack>
        <HStack space="sm" pt="$1" alignItems="center">
          <HStack space="xs">
            <IconUserPlus size={18} color={theme.colors.app.accent} />
            <Text color={theme.colors.app.textSecondary}>
              {`${site.site_view.counts.users.toLocaleString()} ${t("User", {
                count: site.site_view.counts.users,
              })}`}
            </Text>
          </HStack>
          {!site.site_view.local_site.federation_enabled && (
            <HStack space="xs" alignItems="center">
              <IconExclamationCircle size={18} color={theme.colors.app.warn} />
              <Text color={theme.colors.app.warn}>{t("Defederated")}</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode === "Closed" && (
            <HStack space="xs" alignItems="center">
              <IconExclamationCircle size={18} color={theme.colors.app.warn} />
              <Text color={theme.colors.app.warn}>
                {t("Registration Closed")}
              </Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode ===
            "RequireApplication" && (
            <HStack space="xs" alignItems="center">
              <IconExclamationCircle size={18} color={theme.colors.app.info} />
              <Text color={theme.colors.app.info}>
                {t("Application Required")}
              </Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode === "Open" && (
            <HStack space="xs" alignItems="center">
              <IconLockOpen size={18} color={theme.colors.app.success} />
              <Text color={theme.colors.app.success}>
                {t("Open Registration")}
              </Text>
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
