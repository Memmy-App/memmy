import React from "react";
import { GetSiteResponse } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet } from "react-native";
import { HStack, Text, View, VStack } from "@src/components/gluestack";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import FastImage from "@gkasdorf/react-native-fast-image";

interface IProps {
  site: GetSiteResponse;
}

function InstanceItem({ site }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useTranslation();
  const theme = useThemeOptions();

  const onPress = () => {
    navigation.push("Instance", {
      site: site.site_view.site,
      localSite: site.site_view.local_site,
      counts: site.site_view.counts,
    });
  };

  return (
    <Pressable onPress={onPress}>
      <VStack
        backgroundColor={theme.colors.fg}
        mx="$6"
        my="$1.5"
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
              <SFIcon icon="chevron.right" />
            </View>
          </HStack>
        </HStack>
        <HStack>
          <Text>{site.site_view.site.description}</Text>
        </HStack>
        <HStack space="sm" pt="$1" alignItems="center">
          <HStack space="xs">
            <SFIcon icon="person.badge.plus" />
            <Text color={theme.colors.textSecondary}>
              {`${site.site_view.counts.users.toLocaleString()} ${t("User", {
                count: site.site_view.counts.users,
              })}`}
            </Text>
          </HStack>
          {!site.site_view.local_site.federation_enabled && (
            <HStack space="xs" alignItems="center">
              <SFIcon icon="exclamationmark.triangle" />
              <Text color={theme.colors.warn}>{t("Defederated")}</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode === "Closed" && (
            <HStack space="xs" alignItems="center">
              <SFIcon icon="exclamationmark.triangle" />
              <Text color={theme.colors.warn}>{t("Registration Closed")}</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode ===
            "RequireApplication" && (
            <HStack space="xs" alignItems="center">
              <SFIcon icon="exclamationmark.triangle" />
              <Text color={theme.colors.info}>{t("Application Required")}</Text>
            </HStack>
          )}
          {site.site_view.local_site.registration_mode === "Open" && (
            <HStack space="xs" alignItems="center">
              <SFIcon icon="lock.open" />
              <Text color={theme.colors.success}>{t("Open Registration")}</Text>
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
