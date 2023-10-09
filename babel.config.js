module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["."],
          alias: {
            "@src": "./src",
            "@root": ".",
            "@api": "./src/api",
            "@components": "./src/components",
            "@helpers": "./src/helpers",
            "@hooks": "./src/hooks",
            "@locale": "./src/locale",
            "@screens": "./src/screens",
            "@state": "./src/state",
            "@theme": "./src/theme",
            "@types": "./src/types",
          },
        },
      ],
    ],
  };
};
