import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, ScrollView, View } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setCurrentAccount } from "../../../../slices/accounts/accountsActions";
import { selectAccounts } from "../../../../slices/accounts/accountsSlice";
import {
  selectFeed,
  setDropdownVisible,
} from "../../../../slices/feed/feedSlice";
import { Account } from "../../../../types/Account";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import CTable from "../../../common/Table/CTable";

function FeedHeaderDropdownDrawer() {
  const { dropdownVisible } = useAppSelector(selectFeed);
  const accounts = useAppSelector(selectAccounts);

  const dispatch = useAppDispatch();

  const onAccountPress = (account: Account) => {
    dispatch(setCurrentAccount(account));
    dispatch(setDropdownVisible());
  };

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onManageAccountPress = () => {
    navigation.navigate("FeedStack", { screen: "ViewAccounts" });
  };

  if (!dropdownVisible) return null;

  return (
    <Pressable
      style={[styles.container]}
      onPress={() => dispatch(setDropdownVisible())}
    >
      <View style={styles.scrollContainer}>
        <ScrollView>
          <CTable>
            <CSection>
              <Animated.View
                entering={FadeInUp.delay(30).duration(200)}
                exiting={FadeOutUp.delay(30).duration(200)}
              >
                {accounts.map((account) => (
                  <CCell
                    key={account.username}
                    cellStyle="Basic"
                    title={`${account.username}@${account.instance}`}
                    accessory="DisclosureIndicator"
                    onPress={() => onAccountPress(account)}
                  />
                ))}

                <CCell
                  cellStyle="Basic"
                  title="Manage Accounts"
                  onPress={() => onManageAccountPress()}
                  accessory="DisclosureIndicator"
                />
              </Animated.View>
            </CSection>
          </CTable>
        </ScrollView>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .5)",
    position: "absolute",
    zIndex: 1,
    top: -10,
    bottom: 0,
    right: 0,
    left: 0,
  },

  scrollContainer: {
    flex: 1,
    alignItems: "stretch",
    width: "100%",
  },

  table: {
    flex: 1,
    marginHorizontal: 15,
  },

  header: {
    flex: 1,
    backgroundColor: "gray",
  },
});

export default FeedHeaderDropdownDrawer;
