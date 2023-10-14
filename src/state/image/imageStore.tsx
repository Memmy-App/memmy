import { IDimensions } from '@src/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ImageStore {
  dimensions: Map<string, IDimensions>;
}

export const useImageStore = create(
  immer<ImageStore>(() => ({
    dimensions: new Map<string, IDimensions>(),
  })),
);

export const useImageSavedDimensions = (
  source: string,
): IDimensions | undefined =>
  useImageStore((state) => state.dimensions.get(source));

export const saveImageDimensions = (
  source: string,
  dimensions: IDimensions,
): void => {
  useImageStore.setState((state) => {
    state.dimensions.set(source, dimensions);
  });
};
