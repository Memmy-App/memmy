// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = {
  transformer: {
    getTransformOptions: async() => ({
      transform: {
        inlineRequires: false,
      }
    })
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
