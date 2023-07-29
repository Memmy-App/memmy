module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["."],
          alias: {
            "@src": "./src",
            "@root": ".",
          },
        },
      ],
    ],
  };
};
