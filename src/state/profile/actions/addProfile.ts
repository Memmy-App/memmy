import { GetPersonDetailsResponse } from 'lemmy-js-client';
import { useProfileStore } from '@src/state/profile/profileStore';
import { addPosts } from '@src/state/post/actions';
import { addComments } from '@src/state/comment/actions';

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
