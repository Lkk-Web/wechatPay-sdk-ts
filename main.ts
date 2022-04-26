import { IResource } from './lib/interface/common/ICallback';
import { EPayTypeDetail, WechatPayV3Config } from "./lib/interface";
import WechatPay from "./lib/wechatPay";
import { IPayCreateReq } from "./lib/interface/common/IPayCreate";
import { IRefundCreateReq } from "./lib/interface/common/IRefundCreate";
import { TTradeType } from "./lib/interface/common/IPayBase";

/**
 * 腾讯创建订单
 * 参考wechatPay-jdk、ali等方法封装微信支付WechatPay-sdk-ts
 *      -- by 刘康凯 2022年3月17日
 */

export class ServicePayWechat {
    private readonly wechatPay!: WechatPay;
    private readonly CPayWechat: WechatPayV3Config = {
        appId: '',
        mchId: '',
        apiv3: '',
        publicCert: '',
        privateKey: '',
        userAgent: 'wechatpay/v3',
    }
    constructor() {
        try {
            this.wechatPay = new WechatPay(this.CPayWechat);
            setInterval(async () => {
                try {
                    await this.wechatPay.updatePlatformCert()
                } catch (error) {
                    // 更新失败
                }
            }, 1000 * 60 * 60 * 10)
        } catch (error) {
            console.log('error: ', error);
        }
    }

    //查询订单
    async queryTrade(code: string, query: TTradeType) {
        if (!code) throw '禁止访问！'
        let url = query === 'out_trade_no'
            ? `pay/transactions/out-trade-no/${code}`
            : `pay/transactions/id/${code}`
        url += '?mchid=' + this.wechatPay.config.mchId
        const res = this.wechatPay.exec(url, 'GET')
        return res
    }

    //创建订单
    async createTrade(order: IPayCreateReq, type: EPayTypeDetail) {
        //创建订单
        let url: string
        switch (type) {
            case 'Wap':
                url = 'pay/transactions/h5'
                break
            case 'miniProject':
                url = 'pay/transactions/jsapi'
                break
            case 'App':
                url = 'pay/transactions/app'
                break
            case 'Native':
                url = 'pay/transactions/native'
                break
            default:
                console.log('error:其他支付,待开发');
                throw 'error:其他支付,待开发'
        }
        const res = await this.wechatPay.exec(url, 'POST', order, true)
        return JSON.parse(res.data)
    }

    //创建退款
    async createRefund(refund: IRefundCreateReq) {
        const url = 'refund/domestic/refunds'
        const res = await this.wechatPay.exec(url, 'POST', refund, true)
        return JSON.parse(res.data)
    }

    decryptNotify(params: IResource) {
        return this.wechatPay.decryptNotify(params)
    }
}