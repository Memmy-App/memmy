import MdImage from '@components/Common/Markdown/components/MdImage';
import { MdToken } from '@src/types';
import MdLine from '@components/Common/Markdown/components/MdLine';
import MdText from '@components/Common/Markdown/components/MdText';

interface IProps {
  token: MdToken;
  children?: React.ReactNode;
  style?: object;
  href?: string;
  link?: boolean;
  [key: string]: any;
}

export const markdownComponentMap: Record<
  string,
  (props: IProps) => React.JSX.Element
> = {
  inline: MdLine,
  image: MdImage,
  text: MdText,
};

export const markdownComponentFontProps: Record<string, object> = {
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  h5: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  h6: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  s: {
    textDecorationLine: 'line-through',
  },
};

export const markdownComponentTypes = Object.keys(markdownComponentMap);
export const markdownComponentFontTypes = Object.keys(
  markdownComponentFontProps,
);
