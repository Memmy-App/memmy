import sanitizeHtml from "sanitize-html";
import showdown from "showdown";

export const parseMarkdown = (text: string): string => {
    //const parsed = marked.parse(text);
    //return sanitizeHtml(parsed);
    //return parsed;
    const converter = new showdown.Converter();
    return sanitizeHtml(converter.makeHtml(text));
};