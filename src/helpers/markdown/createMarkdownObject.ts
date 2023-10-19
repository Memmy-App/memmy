import MarkdownIt from 'markdown-it';
import { MdToken } from '@src/types';

export const createMarkdownObject = (
  markdown: string | undefined,
): MdToken[] => {
  if (markdown == null) return [];

  const md = MarkdownIt({
    linkify: true,
    typographer: true,
  });

  const result = md.parse(markdown, {});

  console.log(JSON.stringify(result));

  return result as unknown as MdToken[];
};
