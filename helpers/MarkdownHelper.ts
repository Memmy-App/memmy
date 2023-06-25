// eslint-disable-next-line import/prefer-default-export
export const findImages = (
  text: string
): { cleanedText: string; imageLinks: string[] } => {
  if (!text) {
    return {
      cleanedText: "",
      imageLinks: [],
    };
  }

  const pattern = /!\[.*?\]\(([^)]+)\)/g;
  const imageLinks = [];

  const cleanedText = text.replace(pattern, (match, link) => {
    imageLinks.push(link);
    return "";
  });

  return {
    cleanedText,
    imageLinks,
  };
};

export const replaceNoMarkdown = (
  text: string,
  currentInstance: string
): string => {
  const communityPattern = /^\/[cmu]\/(?:\w+|(\w+@\w+\.\w+))$/gm;
  const communityText = text.replace(communityPattern, (match) => {
    const parts = match.split("@");

    return `[${match}](https://${parts[1] ?? currentInstance}${parts[0]})`;
  });

  return communityText;
};
