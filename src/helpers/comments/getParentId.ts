export const getParentId = (path: string): number => {
  const pathArr = path.split('.');

  return Number(pathArr[pathArr.length - 2]);
};
