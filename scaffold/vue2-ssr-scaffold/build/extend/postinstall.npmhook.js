const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)

/**
 * npm install 后 钩子
 * @method cleanMergePackage 清理合并使用的package.json
 */
function cleanMergePackage () {
  fs.writeFileSync(resolve('../../package.json'), fs.readFileSync(resolve('../../package.bak.json')))
  fs.unlinkSync(resolve('../../package.bak.json'))
}

if (fs.existsSync(resolve('../../package.bak.json'))) {
  console.log('完成安装，正在清理……')
  cleanMergePackage()
}
