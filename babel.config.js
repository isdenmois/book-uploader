const inProduction = process.env.ODE_ENV === 'production'

module.exports = api => {
  /*
    alternatively, you can utilize api.env() to get the current NODE_ENV:
    const inProduction = api.env("production");
    const inDevelopment = api.env("development");

    if using api.env(), then these must be defined before invoking the cache
  */
  api.cache.using(() => process.env.NODE_ENV)

  return {
    presets: [
      !inProduction && 'module:metro-react-native-babel-preset',
      inProduction && ['@rnx-kit/babel-preset-metro-react-native', { unstable_transformProfile: 'esbuild' }],
    ].filter(preset => preset),
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
  }
}
