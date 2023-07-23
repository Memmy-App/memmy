module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      ["module-resolver", {
        "root": ["./"],
        "extensions": [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        "alias": {
          "@root": ".",
          "@src": "./src",
          "@components": "./src/components",
        }
      }]
    ],
  };
};
