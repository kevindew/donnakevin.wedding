import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import path from 'path'
import TerserJsPlugin from 'terser-webpack-plugin'

export default (_env, argv) => {
  return {
    entry: './src/main.js',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      assetModuleFilename: '[name].[contenthash][ext][query]'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
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
                postcssOptions: {
                  plugins: [
                    'postcss-import',
                    'postcss-extend',
                    [
                      'postcss-preset-env',
                      {
                        stage: 1,
                        preserve: false,
                        features: { 'image-set-function': false }
                      }
                    ]
                  ]
                }
              }
            }
          ]
        },
        {
          test: /\.(svg|woff|woff2)$/,
          type: 'asset/resource'
        },
        {
          test: /\.(jpg|png)$/,
          type: 'asset',
          // temporary fix for https://github.com/webpack-contrib/image-minimizer-webpack-plugin/issues/217
          generator: {
            filename: '[name][ext]?[contenthash]'
          }
        },
        {
          test: /\.(ics|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]?[contenthash]'
          }
        },
        {
          test: /-redirect\.html$/,
          type: 'asset/resource',
          generator: {
            filename: (pathData) => {
              const match = pathData.filename.match(/\/([^/]+)-redirect\.html$/i)
              return match[1] + '/index.html'
            }
          }
        },
        {
          test: /CNAME/,
          type: 'asset/resource',
          generator: {
            filename: '[name]'
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserJsPlugin({}),
        new CssMinimizerPlugin({})
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true
        }
      }),
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: ['mozjpeg', 'pngquant']
        }
      })
    ]
  }
}
