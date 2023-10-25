import { useFilterStore } from '@src/state';

export const addInstanceFilter = (instance: string): boolean => {
  const exists =
    useFilterStore
      .getState()
      .instanceFilters.findIndex((k) => k === instance.toLowerCase().trim()) >
    -1;

  if (exists) {
    return false;
  }

  useFilterStore.setState((state) => {
    state.instanceFilters = [
      ...state.instanceFilters,
      instance.toLowerCase().trim(),
    ];
  });

  return true;
};

export const removeInstanceFilter = (instance: string): void => {
  useFilterStore.setState((state) => {
    const index = state.instanceFilters.findIndex(
      (k) => k === instance.toLowerCase().trim(),
    );

    if (index === -1) return;

    state.instanceFilters.splice(index, 1);
  });
};
