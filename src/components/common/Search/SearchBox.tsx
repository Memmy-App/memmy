import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { HStack } from "@src/components/common/Gluestack";
import React, { SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, TextInput } from "react-native";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

interface IProps {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  onSubmit?: () => void | Promise<void>;
  inputRef?: React.MutableRefObject<TextInput>;
  autoFocus?: boolean;
  inHeader?: boolean;
}

function SearchBox({
  query,
  setQuery,
  onSubmit,
  inputRef,
  autoFocus = true,
  inHeader = false,
}: IProps) {
  const theme = useThemeOptions();
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!autoFocus || !inputRef) return;
    navigation
      .getParent<BottomTabNavigationProp<any>>()
      ?.addListener("tabPress", () => {
        inputRef?.current?.focus();
      });
  }, [navigation]);

  return (
    <HStack
      backgroundColor={theme.colors.inputBg}
      borderRadius="$2xl"
      borderColor={theme.colors.border}
      borderWidth={1}
      py="$1.5"
      px="$2.5"
      space="sm"
      alignItems="center"
      width={inHeader ? Dimensions.get("screen").width * 0.9 : undefined}
    >
      <SFIcon
        icon={ICON_MAP.SEARCH}
        color={theme.colors.textSecondary}
        size={12}
        style={{ flexShrink: 1 }}
        boxSize={16}
      />
      <TextInput
        ref={inputRef}
        value={query}
        placeholder={t("Search")}
        onChangeText={setQuery}
        style={{
          color: theme.colors.textPrimary,
          flex: 1,
        }}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
        returnKeyLabel="search"
        keyboardAppearance={theme.config.initialColorMode}
        onSubmitEditing={onSubmit}
        hitSlop={{ left: 32, right: 16, top: 8, bottom: 8 }}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {query && (
        <Pressable
          onPress={() => setQuery("")}
          accessibilityLabel="Clear text"
          accessibilityRole="button"
          hitSlop={8}
        >
          <SFIcon
            icon={ICON_MAP.BLOCK}
            color={theme.colors.textSecondary}
            style={{ flexShrink: 1 }}
            size={12}
            boxSize={16}
          />
        </Pressable>
      )}
    </HStack>
  );
}

export default SearchBox;
