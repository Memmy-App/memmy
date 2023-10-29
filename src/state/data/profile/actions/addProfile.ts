import { GetPersonDetailsResponse } from 'lemmy-js-client';
import { addComments, addPosts, useDataStore } from '@src/state';

interface AddProfileParams {
  profile: GetPersonDetailsResponse;
  screenId: string;
}

export const addProfile = ({ profile, screenId }: AddProfileParams): void => {
  if (profile == null) return;

  useDataStore.setState((state) => {
    state.profiles.set(profile.person_view.person.id, profile);
  });

  addPosts(profile?.posts, screenId);
  addComments({
    comments: profile?.comments,
  });
};
