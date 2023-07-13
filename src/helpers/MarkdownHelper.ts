// eslint-disable-next-line import/prefer-default-export
import { Alert } from "react-native";

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

  const pattern = /!\[.*?\]\(([^)]+)\)/g;
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
  postInstance: string
): string => {
  const communityPattern = /(?<=\(|^)\/[cmu]\/(?:\w+|(\w+@\w+\.\w+))(?=\)|$)/gm;

  return text.replace(communityPattern, (match) => {
    const parts = match.split("@");

    return `[${match}](https://${parts[1] ?? postInstance}${parts[0]})`;
  });
};
