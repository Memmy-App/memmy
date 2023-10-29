import { GetPersonDetailsResponse } from 'lemmy-js-client';
import { addComments, addPosts, useProfileStore } from '@src/state';

export const addProfile = (
  profile: GetPersonDetailsResponse | undefined,
  screenId: string,
): void => {
  if (profile == null) return;

  useProfileStore.setState((state) => {
    state.profiles.set(profile.person_view.person.id, profile);
  });

  addPosts(profile?.posts, screenId);
  addComments(profile?.comments);
};
