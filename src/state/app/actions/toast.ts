import { useAppStore } from '@src/state';
import { IToast } from '@src/types/IToast';

const toastDefaults: Partial<IToast> = {
  duration: 3000,
  color: '$info',
};

export const setToast = (toast?: Partial<IToast>): void => {
  useAppStore.setState((state) => {
    if (toast == null) {
      state.toast = null;
      return;
    }

    toast = {
      ...toastDefaults,
      ...toast,
    };

    state.toast = toast as IToast;
  });
};
