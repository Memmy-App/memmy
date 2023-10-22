import React from 'react';
import { INavigationProps } from '@src/types';
import WebView from 'react-native-webview';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const licenseHtml = require('../../../assets/licenseAgreement.html');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const terms = require('../../../assets/terms.html');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const acknowledgements = require('../../../assets/license.html');

export default function WebViewScreen({
  route,
}: INavigationProps): React.JSX.Element {
  const { source } = route.params;

  let content;

  switch (source) {
    case 'licenseAgreement': {
      content = licenseHtml;
      break;
    }
    case 'terms': {
      content = terms;
      break;
    }
    case 'acknowledgements': {
      content = acknowledgements;
      break;
    }
    case 'privacy': {
      content = 'https://memmy.app/privacy.txt';
      break;
    }
    default: {
      content = acknowledgements;
    }
  }

  return (
    <WebView
      style={{ flex: 1 }}
      source={content}
      originWhitelist={['*']}
    ></WebView>
  );
}
