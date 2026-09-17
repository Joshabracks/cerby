const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (_env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    entry: { content: './src/content.ts', panel: './src/panel.ts' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
    },
    resolve: { extensions: ['.ts', '.js'] },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: { loader: 'ts-loader', options: { compilerOptions: { noEmit: false } } },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/panel.html', to: 'panel.html' },
        ],
      }),
    ],
    devtool: isProd ? false : 'cheap-module-source-map',
  };
};
