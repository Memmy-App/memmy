import ApiInstance from "@src/api/common/ApiInstance";

let instance: ApiInstance | null;

export const clearInstance = (): void => {
  instance = null;
};

export const createInstance = (): void => {
  instance = new ApiInstance();
};

// @ts-ignore
export default instance;
