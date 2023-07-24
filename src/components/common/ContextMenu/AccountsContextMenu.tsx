import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setCurrentAccount } from "../../../slices/accounts/accountsActions";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../slices/accounts/accountsSlice";
import { ICON_MAP } from "../../../constants/IconMap";
import { ContextMenuOption } from "../../../types/ContextMenuOptions";
import { AppContextMenuButton } from "./App/AppContextMenuButton";

interface IProps {
  children: React.ReactNode;
  navigation: any;
  isShortPress?: boolean;
}

export function AccountsContextMenu({
  children,
  navigation,
  isShortPress = false,
}: IProps) {
  const { t } = useTranslation();
  const accounts = useAppSelector(selectAccounts);
  const currentAccount = useAppSelector(selectCurrentAccount);

  const dispatch = useAppDispatch();

  const options = useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "manage_accounts_menu",
        title: "",
        inline: true,
        options: [
          {
            key: "manage_accounts",
            title: "Manage Accounts",
            icon: ICON_MAP.CHEVRON.RIGHT,
          },
        ],
      },
      ...accounts.map((account) => ({
        key: account.username + account.instance,
        title: account.username,
        subtitle: account.instance,
      })),
    ],
    [t, accounts]
  );

  const onPressMenuItem = ({ nativeEvent }: OnPressMenuItemEventObject) => {
    if (nativeEvent.actionKey === "manage_accounts") {
      navigation.navigate("FeedStack", { screen: "ViewAccounts" });
    } else {
      const account = accounts.find(
        (a) => a.username + a.instance === nativeEvent.actionKey
      );
      dispatch(setCurrentAccount(account));
      navigation.navigate("FeedStack", { screen: "FeedScreen" });
    }
  };

  return (
    <AppContextMenuButton
      isPrimaryAction={isShortPress}
      options={options}
      selection={currentAccount.username + currentAccount.instance}
      title={t("Accounts")}
      style={{
        flex: 1,
      }}
      onPressMenuItem={onPressMenuItem}
    >
      {children}
    </AppContextMenuButton>
  );
}
