export interface MediaProps {
  source: string;
  postId?: number;
  heightOverride?: number;
  widthOverride?: number;
  style?: object;
  onPress?: () => unknown;
  recycled?: React.MutableRefObject<{}>;
  nsfw?: boolean;
  buttonMode?: boolean;
  setPostRead?: () => void;
  compactMode?: boolean;
}
