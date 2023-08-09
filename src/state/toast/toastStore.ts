import React from "react";
import { create } from "zustand";
import { immer } from "zustand/esm/middleware/immer";

export type ToastVariant = "success" | "error" | "warn" | "info";

interface ShowToast {
  message: string;
  duration?: number;
  variant?: ToastVariant;
  icon?: React.JSX.Element;
}

interface ToastState {
  isOpen: boolean;
  message: string;
  duration?: number;
  variant?: ToastVariant;
  icon?: React.JSX.Element;
}

interface ToastStore {
  state: ToastState;
  actions: {
    showToast: (options: ShowToast) => void;
    hideToast: () => void;
  };
}

export const useAccountStore = create(
  immer<ToastStore>((set) => ({
    state: {
      isOpen: false,
      message: "",
      duration: 0,
      variant: "info",
    },
    actions: {
      showToast: (options: ShowToast) => {
        set((state) => {
          state.state.isOpen = true;
          state.state.message = options.message;
          state.state.duration = options.duration ?? 3000;
          state.state.variant = options.variant ?? "info";
          state.state.icon = options.icon;
        });
      },
      hideToast: () => {
        set((state) => {
          state.state.isOpen = false;
        });
      },
    },
  }))
);

export const useToastState = (): ToastState =>
  useAccountStore((state) => state.state);
export const useShowToast = (): ((options: ShowToast) => void) =>
  useAccountStore((state) => state.actions.showToast);
export const useHideToast = (): (() => void) =>
  useAccountStore((state) => state.actions.hideToast);
