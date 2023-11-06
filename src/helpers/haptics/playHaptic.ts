import { IHapticStrengthOption } from '@src/types/options';
import { useSettingsStore } from '@src/state';
import * as Haptics from 'expo-haptics';

export const playHaptic = async (
  override?: IHapticStrengthOption,
): Promise<void> => {
  const enabled = useSettingsStore.getState().hapticsEnabled;

  if (enabled == null || !enabled) return;

  const hapticStrength =
    override ?? useSettingsStore.getState().hapticsStrength;

  switch (hapticStrength) {
    case 'light':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'strong':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    default:
      break;
  }
};
