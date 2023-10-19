import { useFavoriteCommunities } from '@src/state/favoriteCommunities/favoriteCommunities';

export const addOrUpdateFavorite = (
  accountName: string,
  communityId: number,
): void => {
  useFavoriteCommunities.setState((state) => {
    const favorites = state.favoriteLists.get(accountName);

    if (favorites == null) {
      state.favoriteLists.set(accountName, [communityId]);
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
