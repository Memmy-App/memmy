import { IDimensions } from '@src/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface IStoredDimensionsState {
  dimensions: IDimensions;
  viewerDimensions?: IDimensions;
}

interface ImageStore {
  dimensions: Map<string, IStoredDimensionsState>;
}

export const useImageStore = create(
  immer<ImageStore>(() => ({
    dimensions: new Map<string, IStoredDimensionsState>(),
  })),
);

export const useImageSavedDimensions = (
  source: string,
): IStoredDimensionsState | undefined =>
  useImageStore((state) => state.dimensions.get(source));

export const saveImageDimensions = (
  source: string,
  dimensions: IStoredDimensionsState,
): void => {
  useImageStore.setState((state) => {
    state.dimensions.set(source, dimensions);
  });
};
