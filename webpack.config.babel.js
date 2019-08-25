import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getPlugins } from 'tachyons-build-css';

export default (_env, argv) => {
  return {
    entry: './src/main.js',
    output: {
      path: __dirname + '/dist',
      filename: '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            argv.mode == 'production'
             ? MiniCssExtractPlugin.loader
             : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: getPlugins()
              }
            }
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|woff)$/,
          use: ['file-loader'],
        },
        {
          test: /\.woff2$/,
          use: ['url-loader'],
        },
        {
          test: /\.(ics)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?[contenthash]'
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        }
      }),
    ]
  };
};
