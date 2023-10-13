import { SubscribedType } from 'lemmy-js-client';

export const isSubscribed = (subType: SubscribedType | undefined): boolean => {
  if (subType == null || subType === 'NotSubscribed') return false;
  return true;
};
