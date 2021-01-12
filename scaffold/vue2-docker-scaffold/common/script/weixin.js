// 判断微信环境UA
export function isInWx () {
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent
    if (/weixin/gi.test(ua)) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}