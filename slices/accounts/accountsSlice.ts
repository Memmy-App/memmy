import { createSlice } from "@reduxjs/toolkit";
import { addAccount, loadAccounts } from "./accountsActions";
import { RootState } from "../../store";
import { Account } from "../../types/Account";

interface AccountsState {
  accounts: Account[];
}

const initialState: AccountsState = {
  accounts: [],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAccounts.fulfilled, (state, action) => {
      if (action.payload) state.accounts = action.payload;
    });
    builder.addCase(addAccount.fulfilled, (state, action) => {
      if (action.payload) state.accounts = action.payload;
    });
  },
});

export const selectAccounts = (state: RootState) => state.accounts.accounts;

export default accountsSlice.reducer;
