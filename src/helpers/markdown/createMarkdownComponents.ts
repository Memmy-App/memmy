import React, { createElement, FunctionComponentElement } from 'react';
import { MdToken } from '@src/types';
import {
  markdownComponentFontProps,
  markdownComponentFontTypes,
  markdownComponentMap,
  markdownComponentTypes,
} from '@helpers/markdown/markdownComponentMap';
import MdBlockQuote from '@components/Common/Markdown/components/MdBlockQuote';
import { Text } from 'tamagui';
import { createMarkdownObject } from '@helpers/markdown/createMarkdownObject';

let color = '$color';

let componentStyle = {};
let otherProps = {
  color,
};
let isQuote = false;
let quoteText = '';
let isList = false;

export const createMarkdownComponents = (
  mdObjArr: MdToken[] | string | undefined,
  colorOverride?: string,
): Array<React.FunctionComponentElement<any> | null> => {
  if (color != null) {
    // @ts-expect-error - Weird bug
    color = colorOverride;

    otherProps = {
      color,
    };
  }

  if (mdObjArr == null) {
    return [];
  }

  if (typeof mdObjArr === 'string') {
    mdObjArr = createMarkdownObject(mdObjArr);
  }

  const components: Array<React.FunctionComponentElement<any> | null> = [];

  for (const token of mdObjArr) {
    let children: Array<React.FunctionComponentElement<any> | null> = [];

    if (token.children != null && token.children.length > 0) {
      children = createMarkdownComponents(token.children, color);
    }

    const component = createMarkdownComponent(token, children);
    if (component != null) {
      components.push(component);
    }
  }

  return components;
};

const createMarkdownComponent = (
  token: MdToken,
  children: Array<React.FunctionComponentElement<any> | null>,
): FunctionComponentElement<any> | null => {
  if (!markdownComponentTypes.includes(token.type)) {
    if (
      markdownComponentFontTypes.includes(token.tag) &&
      token.type.includes('open')
    ) {
      componentStyle = {
        ...componentStyle,
        ...markdownComponentFontProps[token.tag],
      };
    }

    const element = handleOtherListTypes(token, children);
    return element;
  }

  if (isQuote && token.type === 'text') {
    quoteText += ` ${token.content}`;
    return null;
  }

  let element = createElement(
    markdownComponentMap[token.type],
    {
      token,
      style: componentStyle,
      ...otherProps,
    },
    children,
  );

  if (isList && token.type === 'text') {
    // @ts-expect-error - TODO: Fix this
    element = createElement(Text, {}, [
      createElement(Text, {}, ['•']),
      element,
    ]);
  }

  if (Object.keys(componentStyle).length > 0) {
    componentStyle = {};
  }

  if (Object.keys(otherProps).length > 0) {
    otherProps = {
      color,
    };
  }

  return element;
};

const handleOtherListTypes = (
  token: MdToken,
  children: Array<React.FunctionComponentElement<any> | null>,
): React.FunctionComponentElement<any | null> | null => {
  switch (token.type) {
    case 'list_item_open': {
      isList = true;
      return null;
    }
    case 'list_item_close': {
      isList = false;
      return null;
    }
    case 'blockquote_open': {
      isQuote = true;
      return null;
    }
    case 'blockquote_close': {
      const element = createElement(
        MdBlockQuote,
        {
          text: quoteText,
        },
        children,
      );

      isQuote = false;
      quoteText = '';
      return element;
    }
    case 'link_open': {
      otherProps = {
        ...otherProps,
        href: token.attrs[0][1],
        link: true,
      };
      return null;
    }
    default: {
      return null;
    }
  }
};
