import { useFavoriteCommunitiesStore } from '@src/state';

export const addOrUpdateFavorite = (
  accountName: string,
  communityId: number,
): void => {
  useFavoriteCommunitiesStore.setState((state) => {
    const favorites = state.favoriteLists[accountName];

    if (favorites == null) {
      state.favoriteLists[accountName] = [communityId];
      return;
    }

    const index = favorites.findIndex((c) => c === communityId);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(communityId);
    }
  });
};
