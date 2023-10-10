import { LemmyHttp } from 'lemmy-js-client';

export let lemmyInstance: LemmyHttp | null;

export const setLemmyInstance = (instance: LemmyHttp): void => {
  lemmyInstance = instance;
};

export const clearLemmyInstance = (): void => {
  lemmyInstance = null;
};
