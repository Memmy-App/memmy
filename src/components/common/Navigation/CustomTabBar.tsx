import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { DrawerActions } from "@react-navigation/native";
import { Box, Text, View, VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { AccountsContextMenu } from "../ContextMenu/AccountsContextMenu";
import TabBarGestureHandler from "./TabBarGestureHandler";

function IconWithText({
  icon,
  label,
  color,
  badge,
}: {
  icon: any;
  label: string;
  color: string;
  badge?: string;
}) {
  const theme = useThemeOptions();
  return (
    <VStack style={{ alignItems: "center" }} space="xs">
      <Box>
        {icon}
        {badge && (
          <Box
            h="$2"
            w="$2"
            bg={theme.colors.errorText}
            rounded="$md"
            style={{
              position: "absolute",
              top: 1,
              right: -3,
            }}
          />
        )}
      </Box>
      <Text color={color} size="xs">
        {label}
      </Text>
    </VStack>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useThemeOptions();
  const insets = useSafeAreaInsets();

  return (
    <TabBarGestureHandler>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.navBarBg,
          paddingTop: 6,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label = options.tabBarLabel ? options.tabBarLabel : "";

          const isFocused = state.index === index;

          const color = isFocused ? colors.accent : colors.textSecondary;

          const icon = options.tabBarIcon({
            color,
            focused: isFocused,
            size: 30,
          });

          const onPress = () => {
            onGenericHapticFeedback();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            navigation.dispatch(DrawerActions.closeDrawer());

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              // @ts-ignore this is valid, types are wrong from React Navigation
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            onGenericHapticFeedback();

            if (route.name === "FeedStack") {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }

            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          if (route.name === "ProfileStack") {
            return (
              <AccountsContextMenu
                navigation={navigation}
                key={label as string}
              >
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                >
                  <IconWithText
                    icon={icon}
                    label={label as string}
                    color={color}
                  />
                </TouchableOpacity>
              </AccountsContextMenu>
            );
          }

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
              key={label as string}
            >
              <IconWithText
                icon={icon}
                label={label as string}
                color={color}
                badge={options.tabBarBadge?.toString()}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </TabBarGestureHandler>
  );
}
