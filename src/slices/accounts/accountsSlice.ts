import { createSlice } from "@reduxjs/toolkit";
import {
  addAccount,
  deleteAccount,
  editAccount,
  loadAccounts,
  setCurrentAccount,
} from "./accountsActions";
import { RootState } from "../../../store";
import { Account } from "../../types/Account";
import { writeToLog } from "../../helpers/LogHelper";

interface AccountsState {
  accounts: Account[];
  currentAccount: Account | null;
  loaded: boolean;
}

const initialState: AccountsState = {
  accounts: [],
  currentAccount: null,
  loaded: false,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAccounts.fulfilled, (state, action) => {
      if (action.payload) {
        state.accounts = action.payload;
        const mainAccount =
          action.payload.find((a) => a.isCurrent) || action.payload[0];
        state.currentAccount = mainAccount;
      }

      state.loaded = true;
    });
    builder.addCase(loadAccounts.rejected, (state) => {
      writeToLog("Error loading accounts.");
      state.loaded = true;
    });
    builder.addCase(addAccount.fulfilled, (state, action) => {
      if (action.payload) state.accounts = action.payload;
      state.currentAccount = action.payload[action.payload.length - 1];
    });
    builder.addCase(editAccount.fulfilled, (state, action) => {
      if (action.payload) state.accounts = action.payload;
    });
    builder.addCase(deleteAccount.fulfilled, (state, action) => {
      state.accounts = action.payload.updatedAccounts;

      if (
        action.payload.deletedAccount.username ===
          state.currentAccount.username &&
        action.payload.deletedAccount.instance === state.currentAccount.instance
      ) {
        state.currentAccount = state.accounts[0];
      }
    });
    builder.addCase(setCurrentAccount.fulfilled, (state, action) => {
      state.currentAccount = action.payload;
    });
  },
});

export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectCurrentAccount = (state: RootState) =>
  state.accounts.currentAccount;

export const selectAccountsLoaded = (state: RootState) => state.accounts.loaded;

export default accountsSlice.reducer;
