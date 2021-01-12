// Webpack打包分析工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// merge base config
const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')
// 判断是否是生产环境: process.env.NODE_ENV === 'development' => isDev
const isDev = process.env.NODE_ENV === 'development'

// prod environment
const devPlugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8889,
    defaultSizes: 'gzip',
    openAnalyzer: true,
    logLevel: 'info'
  })
]

const prodPlugins = []

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: isDev ? devPlugins : prodPlugins
})
