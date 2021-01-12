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

// 根据HTTP Code返回不同的状态提示
export function httpcode2msg (code, successMsg) {
  switch (code) {
    case 301:
      return '请求地址已经移动'
    case 400:
      return '请求参数异常'
    case 401:
      return '您无权访问'
    case 403:
      return '服务器拒绝了您的请求'
    case 404:
      return '请求地址不存在'
    case 408:
      return '服务器处理超时'
    case 500:
      return '服务器开小差啦'
    case 502:
      return '服务器响应错误'
    case 503:
      return '服务器正忙……'
    case 504:
      return '服务器超时'
    default:
      return successMsg
  }
}
