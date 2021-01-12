// boj转换url参数
const parseParam = (param, encode) => {
  let s = []
  const add = (key, val = '') => {
    let _param = encode ? `${encodeURIComponent(key)}=${encodeURIComponent(val)}` : `${key}=${val}`
    s[s.length] = _param
  }
  if (Array.isArray(param)) {
    param.forEach((v, i) => add(i, v))
  } else {
    for (let prefix in param) {
      buildParams(prefix, param[prefix], add)
    }
  }

  return s.join('&')
}

const buildParams = (prefix, obj, add) => {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      if (rBracket.test(prefix)) {
        add(prefix, v)
      } else {
        buildParams(
          prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
          v,
          add
        )
      }
    })
  } else if (typeof obj === 'object') {
    for (let name in obj) {
      buildParams(`${prefix}[${name}]`, obj[name], add)
    }
  } else {
    add(prefix, obj)
  }
}

/**
 * 获取url参数值
 * @param  {string} name [param]
 * @return {string}      [paramValue]
 */
export function getQueryParam (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  let regexS = '[\\?&]' + name + '=([^&#]*)'
  let regex = new RegExp(regexS)
  let resluts = regex.exec(window.location.href)

  if (resluts == null) {
    return undefined
  } else {
    return resluts[1]
  }
}