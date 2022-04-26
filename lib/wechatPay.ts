import { aesGcmDecrypt, buildVerifyStr, getCertificateSerialNo, getSignature, randomStr, sha256WithRsaVerify, unixTimeStamp, urlExclueOrigin } from "./utils";
import { PlatformCert, WechatPayV3Config } from "./interface";
import { IResource } from "./interface/common/ICallback";
import { createDecipheriv, DecipherGCM } from "crypto";
const urllib = require('urllib');

// 微信支付方法
export default class WechatPay {
	readonly config: WechatPayV3Config
	private readonly mchCertSerial: string = ''
	private readonly schema = 'WECHATPAY2-SHA256-RSA2048'  //指出如何形式描述XML文档的元素
	private platformCert!: Buffer;
	constructor(config: WechatPayV3Config) {
		this.config = config;
		try {
			this.mchCertSerial = getCertificateSerialNo(this.config.publicCert as Buffer).toLowerCase()  //将证书转化为buffer			
		} catch (error) {

		}
	}

	async exec(path: string, method: 'GET' | 'POST', params?: object, verify = true) {
		const url = 'https://api.mch.weixin.qq.com/v3/' + path
		const auth = this.buildRequestAuth(method, url, params)
		const res = await urllib.request(url, {
			method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': this.config.userAgent,
				Authorization: auth,
			},
			data: params
		})
		// console.log('res:', JSON.parse(res.data));
		if (res.status !== 200) {
			throw res.res.statusMessage
		}
		if (verify) {
			const _verify = this.verifyRes(res.data, res.headers as any)
			if (!_verify) throw '验签失败'
		}
		return res
	}

	/**
	 * 获取微信证书用于验签使用,微信官方推荐12小时内进行一次获取
	 * sdk提供了自动更新且应用新证书的方法 autoUpdatePlatformCert
	 */
	async updatePlatformCert() {
		const res = await this.exec('certificates', 'GET', undefined, false)
		// console.log('res:', res);
		const { headers, data, status } = res as any
		if (status === 200 && headers) {
			const body = JSON.parse(data)
			// console.log('body:', body);
			for (let i = 0; i < body.data.length; i++) {
				const cert = body.data[i] as PlatformCert
				//判断头信息,拿到当前平台证书
				if (cert.serial_no === headers['wechatpay-serial']) {
					//解密拿到的平台证书
					const rltCert = aesGcmDecrypt(
						cert.encrypt_certificate.nonce,
						cert.encrypt_certificate.associated_data,
						cert.encrypt_certificate.ciphertext,
						this.config.apiv3
					)
					//直接拿返回的新证书进行自身的验签.
					if (sha256WithRsaVerify(
						rltCert,
						headers['wechatpay-signature'] as string,
						buildVerifyStr(
							headers['wechatpay-timestamp'] as string,
							headers['wechatpay-nonce'] as string,
							data
						)
					)) {
						// 验签成功则更新证书
						this.platformCert = rltCert
					}
				}
			}
		}
		//非网络环境导致失败的情况应当停机并打印日志,考虑被劫持数据篡改的情况
		//密钥保存得当虽然不会遭遇太大问题,但这代表解密的后数据将无法使用或报错(具体报错还是怎么样没测过),可能导致连锁bug
		// return undefined
	}

	// 构建请求的认证数据
	private buildRequestAuth(method: "POST" | 'GET', url: string, param?: object) {
		const timeStamp = unixTimeStamp().toString()
		const nonceStr = randomStr()
		const signture = getSignature(method,
			this.config.privateKey as string,
			urlExclueOrigin(url),
			timeStamp,
			nonceStr,
			param
		)
		//获取授权头
		const auth = `${this.schema} `
			+ `mchid="${this.config.mchId}",`
			+ `nonce_str="${nonceStr}",`
			+ `timestamp="${timeStamp}",`
			+ `serial_no="${this.mchCertSerial}",`
			+ `signature="${signture}"`;
		return auth
	}

	/**
	   * 如果平台证书存在,则所有响应都会验证签名,返回boolean.
	   * 如果证书不存在,表示一律通过,全部请求返回 noVerify.
	   * 你可以选择忽略,但在处理敏感操作时,有必要根据验签结果进行处理.
	   * @param body 
	   * @param headers 
	   */
	//验签
	private verifyRes(body: string, headers: { [key: string]: string }) {
		if (this.platformCert) {
			const data = buildVerifyStr(
				headers['wechatpay-timestamp'],
				headers['wechatpay-nonce'],
				body
			)
			return sha256WithRsaVerify(this.platformCert, headers['wechatpay-signature'], data)
		}
		return 'noVerify'
	}

	/**
	 * 
	 * @param resource 
	 * @returns 
	 */
	decryptNotify(resource: IResource) {
		const { ciphertext, associated_data, nonce } = resource;
		const cipher = Buffer.from(ciphertext, 'base64');
		// 解密ciphertext，AEAD_AES_256_GCM算法
		const authTag = cipher.slice(cipher.length - 16); // Tag长度16
		const data = cipher.slice(0, cipher.length - 16);
		const decipher = createDecipheriv('AES-256-GCM', this.config.apiv3, nonce) as DecipherGCM;
		decipher.setAuthTag(authTag);
		decipher.setAAD(Buffer.from(associated_data!));
		const decoded = decipher.update(data, undefined, 'utf8');
		decipher.final();
		return JSON.parse(decoded);
	}
}