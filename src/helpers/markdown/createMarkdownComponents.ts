import React, { createElement, FunctionComponentElement } from 'react';
import { MdToken } from '@src/types';
import {
  markdownComponentMap,
  markdownComponentTypes,
} from '@helpers/markdown/markdownComponentMap';

export const createMarkdownComponents = (
  mdObjArr: MdToken[],
): Array<React.FunctionComponentElement<any> | null> => {
  const components: Array<React.FunctionComponentElement<any> | null> = [];

  for (const token of mdObjArr) {
    let children: Array<React.FunctionComponentElement<any> | null> = [];

    if (token.children != null && token.children.length > 0) {
      children = createMarkdownComponents(token.children);
    }

    const component = createMarkdownComponent(token, children);
    components.push(component);
  }

  return components;
};

const createMarkdownComponent = (
  token: MdToken,
  children: Array<React.FunctionComponentElement<any> | null>,
): FunctionComponentElement<any> | null => {
  if (!markdownComponentTypes.includes(token.type)) return null;

  return createElement(
    markdownComponentMap[token.type],
    {
      token,
    },
    children,
  );
};
