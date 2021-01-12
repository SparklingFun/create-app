// 判断是否是生产环境: process.env.NODE_ENV === 'development' => isDev
const isDev = process.env.NODE_ENV === 'development'
// Node.js Modules
const path = require('path')
const glob = require('glob')
const fs = require('fs')
// Webpack
const webpack = require('webpack')
// 每次打包（无论生产/测试）均重新生成dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Webpack打包分析工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 最小化CSS打包
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// CSS优化
const optimizeCss = require('optimize-css-assets-webpack-plugin')
// 从模版生成文件入口
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 生成多入口多出口后自动匹配对应文件
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin')
// 复制public目录结构到指定位置
const CopyWebpackPlugin = require('copy-webpack-plugin')
// new feature: 解析目录下的config.yml文件配置HtmlWebpackPlugin
const yaml = require('js-yaml')

// 工具函数
/**
 * @method getEntry 获取src下的分页（按目录）
 */
function getEntry () {
  let globPath = 'src/**/*.js' // 匹配src目录下的所有文件夹中的js文件
  // (\/|\\\\) 这种写法是为了兼容 windows和 mac系统目录路径的不同写法
  let pathDir = 'src(\/|\\\\)(.*?)(\/|\\\\)' // 路径为src目录下的所有文件夹
  let files = glob.sync(globPath)
  let dirname, entries = []
  for (let i = 0; i < files.length; i++) {
    dirname = path.dirname(files[i])
    entries.push(dirname.replace(new RegExp('^' + pathDir), '$2').replace('src/', ''))
  }
  return entries
}
/**
 * @method addEntry 生成entry { k:v } 对象
 */
function addEntry () {
  let entryObj = {}
  getEntry().forEach(item => {
    entryObj[item] = path.resolve(__dirname, '..', 'src', item, 'index.js')
  })
  console.log(entryObj)
  return entryObj
}
/**
 * @method addHtmlWebpackPlugin 为每个entry生成plugins
 */
function addHtmlWebpackPlugin () {
  let pluginsArr = []
  getEntry().forEach(item => {
    let config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '..', 'src', item, 'config.yml'))) || {}
    pluginsArr.push(
      new HtmlWebpackPlugin({
        filename: `${item}.html`,
        template: config.mobile ? path.resolve(__dirname, '..' , 'src/mobile.template.html') : path.resolve(__dirname, '..' , 'src/index.template.html'),
        hash: true,
        chunks: ["vendor", item],
        inject: true,
        prefetch: ['*.js'],
        preload: false,
        meta: {
          ...config.meta
        },
        templateParameters: {
          title: config.title
        },
        minify: {
          removeAttributeQuotes: false,
          removeComments: true,
          collapseWhitespace: true,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: true
        }
      })
    )
  })
  return pluginsArr
}
// end

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: addEntry(),
  target: 'web',
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist')
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
      // 针对.jsx单文件组件
      {
        test: /\.(jsx)|(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [
                "import",
                {
                  "libraryName": "antd",
                  "style": "css"
                }
              ],
              ["styled-jsx/babel", { "optimizeForSpeed": true, "plugins": ["styled-jsx-plugin-sass"] }],
              ["@babel/plugin-proposal-class-properties"]
            ]
          }
        }
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
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: isDev,
                  // publicPath: '../'
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
              isDev ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: isDev,
                  publicPath: '/'
                }
              },
              {
                loader: 'css-loader',
                options: { 
                  importLoaders: 1,
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
      // 针对.sass/.scss文件
      {
        test: /\.s[ac]ss$/i,
        oneOf: [
          // 1. <style lang="sass" module>
          {
            resourceQuery: /module/,
            use: [
              isDev ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
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
              isDev ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
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
      },
    ]
  },
  plugins: isDev ? [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].css"
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
  ] : [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].css"
    }),
    // new BundleAnalyzerPlugin(),
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
  ],
}