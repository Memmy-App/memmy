// eslint-disable-next-line import/prefer-default-export

export const findImages = (
  text: string,
  stripWhitespace?: boolean
): { cleanedText: string; imageLinks: string[] } => {
  if (!text) {
    return {
      cleanedText: "",
      imageLinks: [],
    };
  }

  const pattern = /!\[.*?]\(([^)]+)\)/g;
  const imageLinks = [];

  const removeWhitespace = stripWhitespace ? text.replace(/\s\s+/g, " ") : text;
  const cleanedText = removeWhitespace.replace(pattern, (match, link) => {
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
  currentInstance: string,
  postInstance: string
): string => {
  const communityPattern = /(?<=\(|^)\/[cmu]\/(?:\w+|(\w+@\w+\.\w+))(?=\)|$)/gm;

  const withFixedCommunities = text.replace(communityPattern, (match) => {
    const parts = match.split("@");

    return `[${match}](https://${currentInstance}${parts[0]}@${
      parts.length > 1 ? parts[1] : postInstance
    })`;
  });

  const urlPattern =
    /(?<![([])(?i)\b((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)(?![)\]])/gm;

  return withFixedCommunities.replace(
    urlPattern,
    (match) => `[${match}](${match})`
  );
};
