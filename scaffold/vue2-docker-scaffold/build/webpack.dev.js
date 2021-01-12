// Node.js Modules
const path = require('path')
// Webpack
const webpack = require('webpack')
// merge base config
const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')
// 工具函数
const { getHost } = require('./util')

// dev environment
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin({
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    publicPath: '/',
    inline: true,
    quiet: false,
    open: true,
    host: getHost(),
    port: 18001,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/example/, to: '/example.html' },
        { from: /^\/miniapp_active/, to: '/miniapp_active.html' }
      ]
    }
  }
})
