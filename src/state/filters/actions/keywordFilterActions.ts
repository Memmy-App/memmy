import { useFilterStore } from '@src/state';

export const addKeywordFilter = (keyword: string): void => {
  useFilterStore.setState((state) => {
    const exists = state.keywordFilters.findIndex(
      (k) => k === keyword.toLowerCase(),
    );

    if (exists > -1) return;

    state.keywordFilters = [...state.keywordFilters, keyword.toLowerCase()];
  });
};

export const removeKeywordFilter = (keyword: string): void => {
  useFilterStore.setState((state) => {
    const index = state.keywordFilters.findIndex(
      (k) => k === keyword.toLowerCase(),
    );

    if (index === -1) return;

    state.keywordFilters.splice(index, 1);
  });
};
