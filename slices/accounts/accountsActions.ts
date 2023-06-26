import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../types/Account";
import { writeToLog } from "../../helpers/LogHelper";

export const loadAccounts = createAsyncThunk(
  "accounts/loadAccounts",
  async (_, thunkAPI) => {
    try {
      const accountsStr = await AsyncStorage.getItem("@accounts");

      if (!accountsStr) return null;

      return JSON.parse(accountsStr) as Account[];
    } catch (e) {
      writeToLog("Error loading accounts.");
      writeToLog(e.toString());

      thunkAPI.rejectWithValue("Error loading accounts.");
    }
  }
);

export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (account: Account) => {
    const accounts =
      (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ?? [];
    accounts.push(account);
    await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    return accounts;
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

    accounts[index].password = account.password;

    await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    return accounts;
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (account: Account) => {
    const accounts =
      (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ?? [];

    const index = accounts.findIndex(
      (a) => a.username === account.username && a.instance === account.instance
    );

    delete accounts[index];

    await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    return { deletedAccount: account, updatedAccounts: accounts };
  }
);
