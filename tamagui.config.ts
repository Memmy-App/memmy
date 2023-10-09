import { config } from '@tamagui/config/v2-reanimated';
import { createTamagui } from 'tamagui';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
