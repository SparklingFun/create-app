// Generate four random hex digits.  
function S4() {  
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
};  
// Generate a pseudo-GUID by concatenating random hexadecimal.  
function guid() {  
  return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());  
};
// uuid，没有使用npm包，由于小程序环境获取performance等方法无效，因此单独独立一个函数
function uuid(len, radix) {  
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');  
  var uuid = [], i;  
  radix = radix || chars.length;  
 
  if (len) {  
    // Compact form  
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];  
  } else {  
    // rfc4122, version 4 form  
    var r;  
 
    // rfc4122 requires these characters  
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';  
    uuid[14] = '4';  
 
    // Fill in random data.  At i==19 set the high bits of clock sequence as  
    // per rfc4122, sec. 4.1.5  
    for (i = 0; i < 36; i++) {  
      if (!uuid[i]) {  
        r = 0 | Math.random()*16;  
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];  
      }  
    }  
  }  
 
  return uuid.join('');  
}

module.exports = {
  guid,
  uuid
}