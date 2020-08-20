const config = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx'],
      },
    ],
    ['module:react-native-dotenv'],
  ],
};

module.exports = config;
