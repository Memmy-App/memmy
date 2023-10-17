import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface IProps extends Partial<SvgProps> {
  size?: number;
}

function Ellipsis({ size = 20, ...rest }: IProps): React.JSX.Element {
  return (
    <Svg
      // @ts-expect-error valid
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 122.88 29.956"
      xmlSpace="preserve"
      {...rest}
      fill={rest.color}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M122.88 14.978c0 8.271-6.708 14.979-14.979 14.979s-14.976-6.708-14.976-14.979C92.926 6.708 99.631 0 107.901 0s14.979 6.708 14.979 14.978zm-92.926 0c0 8.271-6.708 14.979-14.979 14.979S0 23.248 0 14.978 6.705 0 14.976 0s14.978 6.708 14.978 14.978zm46.463 0c0 8.271-6.708 14.979-14.979 14.979-8.27 0-14.978-6.708-14.978-14.979C46.46 6.708 53.168 0 61.438 0c8.271 0 14.979 6.708 14.979 14.978z"
      />
    </Svg>
  );
}

export default React.memo(Ellipsis);
