import ApiInstance from "@src/api/common/ApiInstance";

// eslint-disable-next-line import/no-mutable-exports
export let instance: ApiInstance | null;

export const clearInstance = (): void => {
  instance = null;
};
