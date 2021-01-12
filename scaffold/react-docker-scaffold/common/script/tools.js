// 异步加载远程JS代码
export function scriptLoader (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          resolve()
        }
      }
    } else {
      script.onload = resolve
    }
    document.body.appendChild(script)
  })
}

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
export function getQueryParam (name, url) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  let regexS = '[\\?&]' + name + '=([^&#]*)'
  let regex = new RegExp(regexS)
  let resluts = regex.exec(url)

  if (resluts == null) {
    return undefined
  } else {
    return resluts[1]
  }
}

/**
 * 拼接url参数
 * @param  {[type]} url      [description]
 * @param  {[type]} param    [description]
 * @param  {[type]} paramval [description]
 * @return {[type]}          [description]
 */
export function getParamUrl (url, param, paramVal) {
  return `${url}${(/\?/.test(url) ? '&' : '?')}${param}=${paramVal}`
}