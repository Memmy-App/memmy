// Import the native module. On web, it will be resolved to ExpoImageCachePath.web.ts
// and on native platforms to ExpoImageCachePath.ts
import ExpoImageCachePathModule from './src/ExpoImageCachePathModule';

export function getCachePath(url: string): string | undefined {
  return ExpoImageCachePathModule.getCachePath(url);
}
