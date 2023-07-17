import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text, useTheme, View, VStack } from "native-base";

import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AccountsContextMenu } from "../ContextMenu/AccountsContextMenu";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
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
  return (
    <VStack style={{ alignItems: "center" }} space={1}>
      {icon}
      <Text color={color} fontSize={12}>
        {label}
      </Text>

      {badge && (
        <View style={iconStyles.badge}>
          <Text style={iconStyles.badgeText}>{badge}</Text>
        </View>
      )}
    </VStack>
  );
}

const iconStyles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -3,
    right: 8,
    backgroundColor: "red",
    borderRadius: 100,
  },

  badgeText: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
});

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <TabBarGestureHandler>
      <View
        style={{
          flexDirection: "row",
          height: 75,
          backgroundColor: colors.app.navBarBg,
          paddingTop: 6,
          paddingHorizontal: 5,
          borderTopWidth: 1,
          borderTopColor: colors.app.border,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label = options.tabBarLabel ? options.tabBarLabel : "";

          const isFocused = state.index === index;

          const color = isFocused
            ? colors.app.accent
            : colors.app.textSecondary;

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

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              // @ts-ignore this is valid, types are wrong from React Navigation
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            onGenericHapticFeedback();

            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          if (route.name === "ProfileStack") {
            return (
              <AccountsContextMenu navigation={navigation}>
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
