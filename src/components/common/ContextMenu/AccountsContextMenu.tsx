import React from "react";
import { useTranslation } from "react-i18next";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setCurrentAccount } from "../../../slices/accounts/accountsActions";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";

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

  const dispatch = useAppDispatch();
  return (
    <ContextMenuButton
      style={{
        flex: 1,
      }}
      onPressMenuItem={({ nativeEvent }) => {
        if (nativeEvent.actionKey === "manage_accounts") {
          navigation.navigate("FeedStack", { screen: "ViewAccounts" });
        } else {
          const account = accounts.find(
            (a) => a.username + a.instance === nativeEvent.actionKey
          );
          dispatch(setCurrentAccount(account));
          navigation.navigate("FeedStack", { screen: "FeedScreen" });
        }
      }}
      isMenuPrimaryAction={isShortPress}
      menuConfig={{
        menuTitle: t("Accounts"),
        menuItems: [
          {
            type: "menu",
            menuTitle: "",
            menuOptions: ["displayInline"],
            menuItems: [
              {
                type: "action",
                actionKey: "manage_accounts",
                actionTitle: t("Manage Accounts"),

                icon: {
                  type: "IMAGE_SYSTEM",
                  imageValue: {
                    systemName: "chevron.right",
                  },
                },
              },
            ],
          },
          ...accounts.map((account) => ({
            actionKey: account.username + account.instance,
            actionTitle: account.username,
            actionSubtitle: account.instance,
          })),
        ],
      }}
    >
      {children}
    </ContextMenuButton>
  );
}
