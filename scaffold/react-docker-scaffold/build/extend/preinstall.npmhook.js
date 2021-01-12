const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)

/**
 * npm install 前 钩子
 * @method mergePrivatePackage 合并项目内package.json
 * 流程: 读取src内package.json, 读取外部package.json, 备份外部package.json, 合并为项目自己的package
 */
let prjProdPkg = null
let prjDevPkg = null
function mergePrivatePackage () {
  // 读取框架自身的package.json依赖与执行脚本
  const frameProdPkg = require(resolve('../../package.json')).dependencies
  const frameDevPkg = require(resolve('../../package.json')).devDependencies
  // 保存原脚本的script从而能够继续执行postinstall
  const frameScripts = require(resolve('../../package.json')).scripts
  // 已经检测过项目内的自身依赖非空，执行合并
  const prodPkg = Object.assign(frameProdPkg, prjProdPkg)
  const devPkg = Object.assign(frameDevPkg, prjDevPkg)
  const pkg = {
    scripts: frameScripts,
    dependencies: prodPkg,
    devDependencies: devPkg
  }
  fs.writeFileSync(resolve('../../package.bak.json'), fs.readFileSync(resolve('../../package.json')))
  fs.writeFileSync(resolve('../../package.json'), JSON.stringify(pkg, null, 2))
}

if (fs.existsSync(resolve('../../src/package.json'))) {
  // 读取项目内的package.json
  prjProdPkg = require(resolve('../../src/package.json')).dependencies
  prjDevPkg = require(resolve('../../src/package.json')).devDependencies
  if (prjProdPkg !== null || prjDevPkg !== null) {
    console.log('发现项目内有额外的包，将执行合并并自动安装……')
    mergePrivatePackage()
  }
}