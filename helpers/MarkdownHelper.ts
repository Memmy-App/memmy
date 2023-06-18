// eslint-disable-next-line import/prefer-default-export
export const findImages = (text: string) => {
  const pattern = /!\[(.*?)\]\((.*?)\)/g;

  let match;
  let imageUrl = null;

  // eslint-disable-next-line no-cond-assign,no-unreachable-loop
  while ((match = pattern.exec(text)) !== null) {
    // eslint-disable-next-line prefer-destructuring
    imageUrl = match[2];
    break;
  }

  return imageUrl;
};
