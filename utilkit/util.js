/**
 * Get User real-ip through Cloudflare (Free Plan).
 * @param {Request} request event.request
 */
export const cfRealIP = (request) => { return request.headers.get('CF-Connecting-IP') }

/**
 * Generate uuid in v4 mode (fake but fit most condition)
 */
export function uuidv4() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return [...bytes].map(b => ('0' + b.toString(16)).slice(-2)).join('') // to hex
}

/**
 * Get cookie both in Web Worker & browser env.
 * @param {*} cookieStr document.cookie或header内的cookie字符串
 * @param {string} key 查找的cookie字符串
 */
export function getCookie(cookieStr, key) {
  let cookieArr = cookieStr.split('; ')
  for(let i = 0; i < cookieArr.length; i++) {
    let temp = cookieArr[i].split('=')
    if(temp[0] === key) {
      return temp[1]
    }
  }
  return ''
}