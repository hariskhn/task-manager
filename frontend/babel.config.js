module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Only include reanimated/plugin. 
      // Do NOT add 'react-native-worklets/plugin' here as it is 
      // now included inside the reanimated plugin automatically.
      'react-native-reanimated/plugin',
    ],
  };
};