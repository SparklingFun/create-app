// Webpack
const webpack = require('webpack')
// merge base config
const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')
// Node.js Modules
const path = require('path')
const os = require('os')
const glob = require('glob')

//获取本机IP,当IP 设置为本机IP 后, 局域网内其它人可以通过 IP+端口,访问本机开发环境.
const getHost = () => {
  let host = '';
  let obj = os.networkInterfaces();
  for (n in obj) {
    obj[n].map(v => {
      /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}$/.test(v.address) && (host = v.address)
    })
  }
  console.log(host)
  return host
}

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
 * @method addDevServerEntry 生成DevServer匹配 { from:'', to:'' } 对象
 */
function addDevServerEntry () {
  let rewritesArr = []
  let pages = getEntry()
  for(let i in pages) {
    let re = new RegExp("^\/" + pages[i] + "")
    rewritesArr.push({
      from: re,
      to: `/${pages[i]}.html`
    })
  }
  // console.log(rewritesArr)
  return rewritesArr
}

// dev environment
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin({
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    publicPath:'/',
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
      rewrites: addDevServerEntry()
    }
  }
});