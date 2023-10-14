import { IHapticStrengthOption } from '@src/types/options';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { trigger } from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const playHaptic = async (
  override?: IHapticStrengthOption,
): Promise<void> => {
  const enabled = useSettingsStore.getState().hapticsEnabled;

  if (enabled == null || !enabled) return;

  const hapticStrength =
    override ?? useSettingsStore.getState().hapticsStrength;

  switch (hapticStrength) {
    case 'light':
      trigger('impactLight', hapticOptions);
      break;
    case 'medium':
      trigger('impactMedium', hapticOptions);
      break;
    case 'strong':
      trigger('impactHeavy', hapticOptions);
      break;
    default:
      break;
  }
};
