

/*---------------------------接口定义-----------------------------*/
export type TPlatform = "Wap" | "miniProject" | "App" | "Web"
export type TMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type TStatus = 'SUCCESS' | 'REFUND' | 'NOTPAY' | 'CLOSED' | 'REVOKED' | 'USERPAYING' | 'PAYERROR' | 'ACCEPT'

//微信支付基本配置
export interface WechatPayV3Config {
  appId: string
  mchId: string
  apiv3: string
  publicCert: Buffer | string
  privateKey: Buffer | string
  userAgent?: string
}
//创建订单
export interface OrderConfig {
  amount: {
    total: number
  },
  description: string,
  notify_url: string,
  out_trade_no: string
}
//微信证书
export interface PlatformCert {
  effective_time: string,
  encrypt_certificate: {
    algorithm: string,
    associated_data: string,
    ciphertext: string,
    nonce: string
  },
  expire_time: string,
  serial_no: string
}

