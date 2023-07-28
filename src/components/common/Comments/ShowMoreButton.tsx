import React, { useCallback } from "react";
import {
  Divider,
  HStack,
  Text,
  View,
  VStack,
} from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/constants/IconMap";
import { Pressable } from "react-native";
import showAllInChain from "@src/stores/posts/actions/showAllInChain";
import { useRoute } from "@react-navigation/core";

interface IProps {
  type: "top" | "children";
  commentId: number;
  depth: number;
}

function ShowMoreButton({ type, commentId, depth }: IProps) {
  const theme = useThemeOptions();
  const { postKey } = useRoute<any>().params;

  const onShowMorePress = useCallback(() => {
    showAllInChain(postKey, commentId, type);
  }, [commentId]);

  return (
    <>
      <Pressable onPress={onShowMorePress}>
        <VStack
          flex={1}
          pr="$2"
          space="sm"
          backgroundColor={theme.colors.fg}
          style={{
            paddingLeft: depth * 8,
          }}
          py="$1"
        >
          <VStack
            borderLeftWidth={depth > 2 ? 2 : 0}
            borderLeftColor={
              theme.colors.comments[depth - 2] ?? theme.colors.comments[5]
            }
            borderTopLeftRadius={1}
            borderBottomLeftRadius={1}
            pl={depth > 2 ? "$2" : "$0"}
            mt="$0"
          >
            <HStack
              space="sm"
              justifyContent="space-between"
              alignItems="center"
              mb={-3}
              pb="$2"
            >
              <Text fontStyle="italic">
                {type === "top"
                  ? "Show more comments..."
                  : "Show more replies..."}
              </Text>
              <SFIcon
                icon={ICON_MAP.CHEVRON.DOWN}
                color={theme.colors.textSecondary}
                size={12}
              />
            </HStack>
          </VStack>
        </VStack>
      </Pressable>
      <View
        style={{
          paddingLeft: depth * 12,
        }}
        backgroundColor={theme.colors.fg}
      >
        <Divider bg={theme.colors.border} />
      </View>
    </>
  );
}

export default ShowMoreButton;
