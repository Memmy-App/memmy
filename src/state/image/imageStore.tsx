import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IAllDimensions } from 'expo-image-viewer';

interface ImageStore {
  dimensions: Map<string, IAllDimensions>;
}

export const useImageStore = create(
  immer<ImageStore>(() => ({
    dimensions: new Map<string, IAllDimensions>(),
  })),
);

export const useImageSavedDimensions = (
  source: string,
): IAllDimensions | undefined =>
  useImageStore((state) => state.dimensions.get(source));

export const saveImageDimensions = (
  source: string,
  dimensions: IAllDimensions,
): void => {
  useImageStore.setState((state) => {
    state.dimensions.set(source, dimensions);
  });
};
