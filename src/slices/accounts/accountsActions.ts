import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import merge from "deepmerge";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Account } from "../../types/Account";
import { writeToLog } from "../../helpers/LogHelper";

const generateTokenKey = () => `lemmyToken.${Crypto.randomUUID()}`;

const populateTokens = async (accounts: Account[]) => {
  const fetchPromises = [];
  accounts.forEach((a) => {
    if (a.tokenKey)
      fetchPromises.push(
        SecureStore.getItemAsync(a.tokenKey).then((token) => {
          a.token = token;
        })
      );
  });
  await Promise.all(fetchPromises);
  return accounts;
};

export const loadAccounts = createAsyncThunk(
  "accounts/loadAccounts",
  async (_, thunkAPI) => {
    try {
      const accountsStr = await AsyncStorage.getItem("@accounts");

      if (!accountsStr) return null;

      const accounts = await populateTokens(
        JSON.parse(accountsStr) as Account[]
      );
      return accounts;
    } catch (e) {
      writeToLog("Error loading accounts.");
      writeToLog(e.toString());

      return thunkAPI.rejectWithValue("Error loading accounts.");
    }
  }
);

export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (account: Account) => {
    const accounts =
      (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ?? [];
    accounts.forEach((a) => delete a.isCurrent);
    account.isCurrent = true;

    account.tokenKey = generateTokenKey();
    await SecureStore.setItemAsync(account.tokenKey, account.token);

    const accountToSave = merge({}, account);
    delete accountToSave.token;
    accounts.push(accountToSave);
    await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));

    return populateTokens(accounts);
  }
);

export const editAccount = createAsyncThunk(
  "accounts/editAccount",
  async (account: Account) => {
    const accounts =
      (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ?? [];

    const index = accounts.findIndex(
      (a) => a.username === account.username && a.instance === account.instance
    );

    if (!accounts[index].tokenKey)
      accounts[index].tokenKey = generateTokenKey();
    await SecureStore.setItemAsync(accounts[index].tokenKey, account.token);

    delete accounts[index].token;
    delete (<any>accounts[index]).password; // legacy signins
    await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));

    await populateTokens(accounts);
    return { editedAccountIndex: index, updatedAccounts: accounts };
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (account: Account) => {
    const accounts =
      (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ?? [];

    const updatedAccounts = [];
    const deletePromises = [];
    accounts.forEach((a) => {
      if (a.username === account.username && a.instance === account.instance) {
        if (a.tokenKey)
          deletePromises.push(SecureStore.deleteItemAsync(a.tokenKey));
      } else updatedAccounts.push(a);
    });
    await Promise.all(deletePromises);

    await AsyncStorage.setItem("@accounts", JSON.stringify(updatedAccounts));

    await populateTokens(updatedAccounts);
    return { deletedAccount: account, updatedAccounts };
  }
);

export const setCurrentAccount = createAsyncThunk(
  "accounts/setCurrentAccount",
  async (account: Account) => {
    const accounts =
      (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ?? [];

    accounts.forEach((a) => {
      if (a.username === account.username && a.instance === account.instance)
        a.isCurrent = true;
      else delete a.isCurrent;
    });

    await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    return account;
  }
);
