// 判断是否是生产环境: process.env.NODE_ENV === 'development' => isDev
const isDev = process.env.NODE_ENV === 'development'
// Node.js Modules
const path = require('path')
// Webpack
const webpack = require('webpack')
// 基本的Vue解析配置
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 每次打包（无论生产/测试）均重新生成dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 最小化CSS打包
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 生成多入口多出口后自动匹配对应文件
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin')
// 复制public目录结构到指定位置
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 工具函数
const { addEntry, addHtmlWebpackPlugin } = require('./util')

// plugins preset
const devPlugins = [
  new VueLoaderPlugin(),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].[hash:8].css',
    chunkFilename: '[id].css'
  }),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  }),
  ...addHtmlWebpackPlugin(),
  new ResourceHintWebpackPlugin(),
  new CopyWebpackPlugin([
    {
      from: 'public',
      to: './'
    }
  ])
]

const prodPlugins = [
  new VueLoaderPlugin(),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].[hash:8].css',
    chunkFilename: '[id].css'
  }),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  }),
  ...addHtmlWebpackPlugin(),
  new ResourceHintWebpackPlugin(),
  new CopyWebpackPlugin([
    {
      from: 'public',
      to: './'
    }
  ])
]

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: addEntry(),
  target: 'web',
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.sass', '.scss', '.js', '.css'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '&': path.resolve(__dirname, '../common')
    }
  },
  module: {
    rules: [
      // 针对.vue单文件组件
      {
        test: /\.vue$/i,
        use: ['vue-loader']
      },
      // 针对js & jsx
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                'component',
                {
                  libraryName: 'element-ui',
                  styleLibraryName: 'theme-chalk'
                }
              ]
            ]
          }
        }
      },
      // 针对.sass/.scss文件
      {
        test: /\.s[ac]ss$/i,
        oneOf: [
          // 1. <style lang="sass" module>
          {
            resourceQuery: /module/,
            use: [
              {
                loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                options: isDev ? {} : {
                  hmr: isDev,
                  publicPath: '/'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    require('autoprefixer')({})
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          // 2. <style lang="sass">
          {
            use: [
              {
                loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                options: isDev ? {} : {
                  hmr: isDev,
                  publicPath: '/'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    require('autoprefixer')({})
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      // 针对.css文件
      {
        test: /\.css$/i,
        oneOf: [
          // 1. <style module>
          {
            resourceQuery: /module/,
            use: [
              {
                loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                options: isDev ? {} : {
                  hmr: isDev,
                  publicPath: '/'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    require('autoprefixer')({})
                  ]
                }
              }
            ]
          },
          // 2. <style>
          {
            use: [
              {
                loader: 'vue-style-loader'
              },
              {
                loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                options: isDev ? {} : {
                  hmr: isDev,
                  publicPath: '/'
                }
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    require('autoprefixer')({})
                  ]
                }
              }
            ]
          }
        ]
      },
      // 针对小于2k的静态图片 -> base64
      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 2048
        }
      },
      // 针对小于8k的特殊静态资源
      {
        test: /\.(eot|woff|woff2|ttf|otf)(\?.*)?$/i,
        loader: 'file-loader',
        options: {
          limit: 8192,
          name: '[path][name].[ext]',
          outputPath: 'static/'
        }
      }
    ]
  },
  plugins: isDev ? devPlugins : prodPlugins
}
