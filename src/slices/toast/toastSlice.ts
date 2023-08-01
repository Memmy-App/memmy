import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

export type ToastVariant = "success" | "error" | "warn" | "info";

interface ShowToast {
  message: string;
  duration?: number;
  variant?: ToastVariant;
  icon?: JSX.Element;
}

interface ToastState {
  isOpen: boolean;
  message: string;
  duration?: number;
  variant?: ToastVariant;
  icon?: JSX.Element;
}

const initialState: ToastState = {
  isOpen: false,
  message: "",
  duration: 0,
  variant: "info",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state: ToastState, action: PayloadAction<ShowToast>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.duration = action.payload.duration;
      state.variant = action.payload.variant;
      state.icon = action.payload.icon;
    },
    hideToast: (state: ToastState) => {
      state.isOpen = false;
    },
  },
});
export const selectToast = (state: RootState) => state.toast;

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
