import { createSlice } from "@reduxjs/toolkit";
import { addAccount, editAccount, loadAccounts } from "./accountsActions";
import { RootState } from "../../store";
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
  reducers: {
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAccounts.fulfilled, (state, action) => {
      if (action.payload) {
        state.accounts = action.payload;
        const [mainAccount] = action.payload;
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
  },
});

export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectCurrentAccount = (state: RootState) =>
  state.accounts.currentAccount;

export const selectAccountsLoaded = (state: RootState) => state.accounts.loaded;

export const { setCurrentAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
