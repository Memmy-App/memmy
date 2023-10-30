import { LocalUser } from 'lemmy-js-client';
import { useDataStore } from '@src/state';
import instance from '@src/Instance';

type ValueOption =
  | 'Active'
  | 'Hot'
  | 'New'
  | 'Old'
  | 'TopDay'
  | 'TopWeek'
  | 'TopMonth'
  | 'TopYear'
  | 'TopAll'
  | 'MostComments'
  | 'NewComments'
  | 'TopHour'
  | 'TopSixHour'
  | 'TopTwelveHour'
  | 'TopThreeMonths'
  | 'TopSixMonths'
  | 'TopNineMonths'
  | boolean
  | string
  | undefined
  | 'All'
  | 'Local'
  | 'Subscribed'
  | number;

export const setUserSetting = async (
  setting: keyof LocalUser,
  value: ValueOption,
): Promise<void> => {
  // First we will set the setting so that our switches cooperate with us and so that we can get the current value
  let oldValue: ValueOption;

  useDataStore.setState((state) => {
    const settings = state.site.site?.my_user?.local_user_view.local_user;

    if (settings == null) return;

    oldValue = settings[setting];
    // @ts-expect-error - checked
    settings[setting] = value;
  });

  try {
    await instance.setUserSetting(setting, value);
  } catch (e) {
    useDataStore.setState((state) => {
      const settings = state.site.site?.my_user?.local_user_view.local_user;

      if (settings == null) return;

      // @ts-expect-error - checked
      settings[setting] = oldValue;
    });
  }
};
