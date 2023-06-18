import { createSlice } from "@reduxjs/toolkit";
import { addAccount, editAccount, loadAccounts } from "./accountsActions";
import { RootState } from "../../store";
import { Account } from "../../types/Account";

interface AccountsState {
  accounts: Account[];
  currentAccount: Account | null;
}

const initialState: AccountsState = {
  accounts: [],
  currentAccount: null,
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
    });
    builder.addCase(addAccount.fulfilled, (state, action) => {
      if (action.payload) state.accounts = action.payload;
    });
    builder.addCase(editAccount.fulfilled, (state, action) => {
      if (action.payload) state.accounts = action.payload;
    });
  },
});

export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectCurrentAccount = (state: RootState) =>
  state.accounts.currentAccount;

export const { setCurrentAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
