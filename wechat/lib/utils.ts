import { createDecipheriv, createSign, createVerify, KeyLike, randomUUID, VerifyKeyObjectInput, VerifyPublicKeyInput, X509Certificate } from "crypto";
import { URL } from "url";
import { CPayWechat } from "../constants/payWechat";
import { TMethods } from "./interface";

/*---------------------------辅助函数-----------------------------*/
const schema = 'WECHATPAY2-SHA256-RSA2048'  //指出如何形式描述XML文档的元素
export let platformCert: Buffer | null = null //平台证书
// const mchCertSerial = getCertificateSerialNo(CPayWechat.publicCert as Buffer).toLowerCase()  //将证书转化为buffer
const mchCertSerial = ''
//更新证书
export function setPlatformCert(cert: Buffer) {
  platformCert = cert
}
// 生成时间戳
export function unixTimeStamp() {
  return Math.floor(Date.now() / 1000)
}
//生成随机字符串
export function randomStr(length = 32) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var maxPos = chars.length;
  var noceStr = "";
  for (var i = 0; i < (length || 32); i++) {
    noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return noceStr;
}
//生成原始数据签名
export function getSignature(method: TMethods, pathname: string, timeStamp: number | string, nonceStr: string, body?: object | string) {
  if (body) {
    if (body instanceof Object) {
      body = JSON.stringify(body)
    }
  } else {
    body = ''
  }
  const data = [method, pathname, timeStamp, nonceStr, body].join('\n') + '\n'
  return data
  // return sha256WithRsaSign(data)
}
//签名算法，加密
export function sha256WithRsaSign(plaintext: string) {
  return createSign('RSA-SHA256').update(plaintext).sign(CPayWechat.privateKey, 'base64')
}
//验证微信平台响应签名
export function sha256WithRsaVerify(publicKey: KeyLike | VerifyKeyObjectInput | VerifyPublicKeyInput, signature: string, data: string) {
  return createVerify('RSA-SHA256').update(data).verify(publicKey, signature, 'base64')
}
//获取授权头
export function getAuthorization(nonceStr: string, timeStamp: string | number, signature: string) {
  return (
    schema + ' ' + trimBlank(`
      mchid="${CPayWechat.mchId}",
      nonce_str="${nonceStr}",
      timestamp="${timeStamp}",
      serial_no="${mchCertSerial}",
      signature="${signature}"
      `)
  )
}
// 创建验签名串
export function buildVerifyStr(resTimestamp: string, resNonce: string, resBody: string) {
  return [resTimestamp, resNonce, resBody].join('\n') + '\n'
}

// 解密平台响应

export function aesGcmDecrypt(nonce: string, associatedData: string, ciphertext: string) {
  try {
    let ciphertextBuffer = Buffer.from(ciphertext, 'base64')
    let authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16)
    let data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16)
    let decipherIv = createDecipheriv('aes-256-gcm', CPayWechat.apiv3, nonce)
    decipherIv.setAuthTag(authTag)
    decipherIv.setAAD(Buffer.from(associatedData))
    let decryptBuf = decipherIv.update(data)
    decipherIv.final()
    return decryptBuf
  } catch (error) {
    err('密钥解密失败', '请检查平台配置密钥是否正确')
    throw error;
  }
}

export function getCertificateSerialNo(buf: Buffer) {
  const x509 = new X509Certificate(buf)
  return x509.serialNumber
}


export function utf8Tobase64(utf8str: string) {
  return Buffer.from(utf8str).toString('base64')
}

export function base64ToUtf8(base64str: string) {
  return (Buffer.from(base64str, 'base64').toString())
}

/**
 * 去掉对象中所有undefined和null
 * @param obj 
 * @returns 
 */
export function delEmpty(obj: any) {
  const result = { ...obj }
  const oKeys = Object.keys(result)
  for (const key of oKeys) {
    if (result[key] === undefined || result[key] === null) {
      delete result[key]
    }
    if (typeof result[key] === 'object') {
      if (Array.isArray(result[key])) {
        result[key] = result[key].filter((
          item: any) => (item !== undefined && item !== null)
        )
      } else {
        result[key] = delEmpty(result[key])
      }
    }
  }
  return result
}

//排除域名中Origin 例如:http://www.a.com/v3/2?a=2 结果为/v3/2?a=2
export function urlExclueOrigin(url: string) {
  const _url = new URL(url)
  return url.replace(_url.origin, '')
}

// 去除文本所有空格,换行
export function trimBlank(str: string) {
  return str.replace(/[\s]/g, '')
}
/**
 * 返回所有文本的长度
 * @param args 
 * @returns 
 */
export function allStrLen(...args: string[]) {
  return args.reduce<number>((prev, cur) => {
    return prev + cur.length
  }, 0)
}
/**
 * 打印日志,flag为绿色.
 * @param flag 
 * @param args 
 */
export function log(flag: string, ...args: any) {
  console.log(`\x1b[32m[${flag}]\x1b[0m`, ...args)
}
/**
 * 打印错误,flag为红色
 * @param flag 
 * @param args 
 */
export function err(flag: string, ...args: any) {
  console.log(`\x1b[31m[${flag}]\x1b[0m`, ...args)
}
/**
 * 打印警告,flag为黄色
 * @param flag 
 * @param args 
 */
export function warn(flag: string, ...args: any) {
  console.log(`\x1b[33m[${flag}]\x1b[0m`, ...args)
}

export function intervalDays(comparedA: Date, comparedB: Date) {
  function dateFormat(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }
  const a = Date.parse(dateFormat(comparedA))
  const b = Date.parse(dateFormat(comparedB))
  if (a === b) {
    return 0
  }
  return Math.abs(a - b) / (1000 * 60 * 60 * 24)
}

export function promiseTry(fn: any) {
  return new Promise((resolve) => resolve(fn()))
}

/**
 * uuidV4,订单号可以使用
 * @param disableEntropyCache node为了提高效率,会生成并缓存足够多的随机数据,设为true可以在不缓存的情况下生成.(考虑实际使用情况选择,推荐保持默认)
 * @returns 
 */
export function uuid(disableEntropyCache = false) {
  return randomUUID({ disableEntropyCache: disableEntropyCache })
}