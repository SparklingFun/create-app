// merge base config
const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')

// dev environment
module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
  ]
});