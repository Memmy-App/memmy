import { GetSiteResponse } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

export const setSite = (siteResponse: GetSiteResponse): void => {
  useDataStore.setState((state) => {
    state.site.site = siteResponse;
    state.site.moderatedIds = siteResponse.my_user?.moderates.map(
      (m) => m.community.id,
    );
  });
};
