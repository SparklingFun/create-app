import { scriptLoader } from './tools'

// 判断微信环境UA
export function isInWx () {
  if(typeof window !== 'undefined') {
    let ua = navigator.userAgent
    if(/weixin/gi.test(ua)) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 配置微信分享
 * @param {Object} opt 微信分享的配置项
 * @param {String} opt.signurl 调用的微信分享内部签名接口地址
 */
export function wxShareConfig(opt = {}) {
  let option = {
    title: opt.title || 'Qingclass',
    desc: opt.desc || '',
    link: opt.link || window.location.href,
    imgUrl: opt.imgUrl || '',
  }

  if(isInWx) {
    scriptLoader('https://res.wx.qq.com/open/js/jweixin-1.4.0.js').then(
      success => {

      },
      fail => {

      }
    )
    return {

    }
  }
}