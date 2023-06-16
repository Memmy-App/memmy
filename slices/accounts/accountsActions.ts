import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Account} from "../../types/Account";

export const loadAccounts = createAsyncThunk(
    "accounts/loadAccounts",
    async () => {
        const accountsStr = await AsyncStorage.getItem("@accounts");

        if(!accountsStr) return null;

        return JSON.parse(accountsStr) as Account[];
    }
);

export const addAccount = createAsyncThunk(
    "accounts/addAccount",
    async (account: Account) => {
        const accounts = JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[] ?? [];
        accounts.push(account);
        await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
        return accounts;
    }
);