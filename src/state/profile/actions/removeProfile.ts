import { useProfileStore } from '@src/state/profile/profileStore';

export const removeProfile = (profileId?: number): void => {
  useProfileStore.setState((state) => {
    if (profileId == null) return;

    state.profiles.delete(profileId);
  });
};
