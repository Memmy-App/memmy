import { CommunityView, GetSiteResponse } from 'lemmy-js-client';

export interface SiteState {
  site?: GetSiteResponse;
  subscriptions: CommunityView[];
  moderated: CommunityView[];
  moderatedIds?: number[];
}
