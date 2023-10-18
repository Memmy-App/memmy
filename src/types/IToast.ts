import { NamedExoticComponent } from 'react';

export interface IToast {
  title?: string;
  text: string;
  duration: number;
  onPress?: () => unknown;
  icon?: NamedExoticComponent;
}
