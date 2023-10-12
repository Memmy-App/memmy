import React, { useMemo } from 'react';
import { createMarkdownComponents } from '@helpers/markdown';
import VStack from '@components/Common/Stack/VStack';

interface IProps {
  children: string | undefined;
  color?: string;
}

function Markdown({
  children,
  color = '$secondary',
}: IProps): React.JSX.Element {
  const components = useMemo(
    () => createMarkdownComponents(children, color),
    [children],
  );

  return <VStack>{components}</VStack>;
}

export default React.memo(Markdown);
