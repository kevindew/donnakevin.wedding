import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import path from 'path'
import postcssImport from 'postcss-import'
import postcssExtend from 'postcss-extend'
import postcssPresetEnv from 'postcss-preset-env'
import TerserJsPlugin from 'terser-webpack-plugin'

export default (_env, argv) => {
  return {
    entry: './src/main.js',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].[hash].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            argv.mode === 'production'
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
                  postcssPresetEnv({
                    stage: 1,
                    preserve: false,
                    features: {
                      'image-set-function': false
                    }
                  })
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif|woff|woff2)$/,
          use: ['file-loader']
        },
        {
          test: /\.ics$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?[contenthash]'
              }
            }
          ]
        },
        {
          test: /-redirect\.html$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                regExp: /\/([^/]+)-redirect\.html$/i,
                name: '[1]/index.html'
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimizer: [new TerserJsPlugin({}), new OptimizeCssAssetsPlugin({})]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true
        }
      })
    ]
  }
}
