import { useDataStore } from '@src/state';

interface RemoveProfileParams {
  profileId?: number;
}

export const removeProfile = ({ profileId }: RemoveProfileParams): void => {
  useDataStore.setState((state) => {
    if (profileId == null) return;

    state.profiles.delete(profileId);
  });
};
