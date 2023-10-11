import MdImage from '@components/Common/Markdown/components/MdImage';
import { MdToken } from '@src/types';
import MdParagraph from '@components/Common/Markdown/components/MdParagraph';
import MdLine from '@components/Common/Markdown/components/MdLine';

interface IProps {
  token: MdToken;
  children?: React.ReactNode;
  [key: string]: any;
}

export const markdownComponentMap: Record<
  string,
  (props: IProps) => React.JSX.Element
> = {
  inline: MdLine,
  image: MdImage,
  text: MdParagraph,
};

export const markdownComponentTypes = Object.keys(markdownComponentMap);
