const path = require("path");

/**
 * @method getHost 获取局域网IP地址
 */
const getHost = () => {
  let localIP = null
  const interfaces = require('os').networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.mac !== '00:00:00:00:00:00') {
        localIP = alias.address
      }
    }
  }

  localIP = localIP || '127.0.0.1'
  return localIP
}

/**
 * @method rootPath 定位到根目录
 * @param {string} _dir 续写目录
 */
const rootPath = (_dir) => {
  return path.resolve(process.cwd(), _dir)
}

const Tool = {
  getHost,
  rootPath
}

module.exports = Tool