import React, { useMemo } from 'react';
import { createMarkdownComponents } from '@helpers/markdown';
import { YStack } from 'tamagui';

interface IProps {
  children: string | undefined;
  color?: string;
}

function Markdown({ children, color = '$color' }: IProps): React.JSX.Element {
  const components = useMemo(
    () => createMarkdownComponents(children, color),
    [children],
  );

  return <YStack>{components}</YStack>;
}

export default React.memo(Markdown);
