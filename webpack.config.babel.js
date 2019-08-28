import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import postcssImport from 'postcss-import';
import postcssExtend from 'postcss-extend';
import postcssPresetEnv from 'postcss-preset-env';

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
                ident: 'postcss',
                plugins: () => [
                  postcssImport(),
                  postcssExtend(),
                  postcssPresetEnv({ stage: 1, preserve: false })
                ]
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
