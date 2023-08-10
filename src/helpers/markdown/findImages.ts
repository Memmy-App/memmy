export const findImages = (
  text?: string,
  stripWhitespace?: boolean
): { cleanedText: string; imageLinks: string[] } => {
  if (!text) {
    return {
      cleanedText: "",
      imageLinks: [],
    };
  }

  const pattern = /!\[.*?\]\(([^)]+)\)/g;
  const imageLinks: string[] = [];

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
