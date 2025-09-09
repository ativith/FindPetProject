module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      "inline-dotenv",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: "../.env",
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
