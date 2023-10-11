import MdImage from '@components/Common/Markdown/components/MdImage';
import { MdToken } from '@src/types';
import MdLine from '@components/Common/Markdown/components/MdLine';
import MdText from '@components/Common/Markdown/components/MdText';

interface IProps {
  token: MdToken;
  children?: React.ReactNode;
  style?: object;
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
  strong_open: {
    fontWeight: 'bold',
  },

  em_open: {
    fontStyle: 'italic',
  },
};

export const markdownComponentTypes = Object.keys(markdownComponentMap);
export const markdownComponentFontTypes = Object.keys(
  markdownComponentFontProps,
);
