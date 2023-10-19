import React from 'react';
import { MdToken } from '@src/types';
import CommentImageButton from '@components/Comment/components/CommentImageButton';

interface IProps {
  token: MdToken;
}

function MdImage({ token }: IProps): React.JSX.Element {
  return <CommentImageButton source={token.attrs[0][1]} />;
}

export default MdImage;
