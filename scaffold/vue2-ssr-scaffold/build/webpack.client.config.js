const path = require('path')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const isProd = process.env.NODE_ENV === "production";
const baseConfig = require('./webpack.base.config.js')

module.exports = merge(baseConfig, {
  entry: {
    app: path.resolve(__dirname, '../src/entry-client.js')
  },
  output: {
    filename: isProd ? "[name].[hash:8].js" : "[name].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/dist/"
  },
  plugins: [
    new VueSSRClientPlugin()
  ],
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity,
      chunks: "all"
    }
  }
})