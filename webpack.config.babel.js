import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './src/js/main.js',
  output: {
    path: __dirname + '/dist',
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ]
};
