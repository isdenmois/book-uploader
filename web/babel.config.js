module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], 'babel-preset-solid', '@babel/preset-typescript'],
  plugins: ['babel-plugin-transform-vite-meta-env'],
}