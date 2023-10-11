import React from 'react';
import {
  createMarkdownComponents,
  createMarkdownObject,
} from '@helpers/markdown';

interface IProps {
  children: string | undefined;
}

function Markdown({ children }: IProps): React.JSX.Element {
  // const items = useMemo(() => createMarkdownComponents(children), [children]);

  const obj = createMarkdownObject(children);
  const components = createMarkdownComponents(obj);

  return <>{components}</>;
}

export default React.memo(Markdown);
