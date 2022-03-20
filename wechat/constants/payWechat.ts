import * as fs from 'fs';
import { join } from 'lodash';
import { WechatPayV3Config } from '../lib/interface';
const rootDir = join(__dirname, '../..');

/*
*此文件作为常量应用，正式代码中使用者请谨慎使用加密文件
*/
export const CPayWechat: WechatPayV3Config = {
    appId: 'string',
    mchId: 'string',
    apiv3: 'string',
    publicCert: '',
    privateKey: 'string',
    userAgent: 'wechatpay/v3',
}

// 支付回调 监听路径
export const CPayWechatHookUrl = '/hook/wechat/pay';

export const CPayWechatNotifyUrl = 'http:127.0.0.1' + CPayWechatHookUrl;

(() => {
    try {
        CPayWechat.publicCert = fs.readFileSync(join(rootDir, "fixtures/wechatpay/publicCert.pem"), "ascii");
        CPayWechat.privateKey = fs.readFileSync(join(rootDir, "fixtures/wechatpay/privateKey.pem"), "ascii");
    } catch (error) {
        console.error('微信支付证书不存在！！！')
    }
})()