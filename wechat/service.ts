import { TPlatform } from "./lib/interface";
import WechatPay from "./lib/wechatPay";
import { IPayCreateReq } from "./lib/interface/common/IPayCreate";
import { IRefundCreateReq } from "./lib/interface/common/IRefundCreate";
import { IPayQueryReq } from "./lib/interface/common/IPayQuery";
import { ITradeType, TTradeType } from "./lib/interface/common/IPayBase";
// import * as WXPay from "weixin-pay";
// const WXPay = require('weixin-pay')


/**
参考wechatPay-jdk、ali等方法封装微信支付WechatPay-sdk-ts
 *      -- by lkk 2022年3月17日
 */

export class ServicePayWechat {
    private readonly wechatPay!: WechatPay;
    constructor() {
        try {
            this.wechatPay = new WechatPay();
        } catch (error) {
            console.log('error: ', error);
        }
    }
    //查询订单
    async queryTrade(idType: ITradeType, query: TTradeType) {
        try {
            let id: string | undefined
            id = idType.transaction_id || idType.out_trade_no
            if (!id) throw { code: 400, message: '类型错误' }
            const res = await this.wechatPay.getOrder(id, query)
            return res
        } catch (error) {
            console.log('error: ', error);
        }
    }
    //创建订单
    async createTrade(order: IPayCreateReq, type: TPlatform) {
        try {
            const res = await this.wechatPay.orderFrom(order, type)
            return res
        } catch (error) {
            console.log('error: ', error);
        }
    }
    //创建退款
    async createRefund(refund: IRefundCreateReq) {
        try {

        } catch (error) {
            console.log('error: ', error);
        }
    }
    //     let { appID } = this.getAppID(platform);
    //     let wxpay = this.getWXPay(platform);
    //     var params = {
    //         appid: appID,
    //         mch_id: this.configs.info.wechatPay.appID,
    //         out_refund_no: refundNo,
    //         total_fee: payAmount, //原支付金额
    //         refund_fee: refundAmount, //退款金额
    //         transaction_id: transactionID,
    //         notify_url: notifyUrl,
    //     };
    //     let ret = await new Promise((resolve, reject) => {
    //         wxpay.refund(params, function (err, result) {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(result);
    //             }
    //         });
    //     });
    //     return ret;
    // }
}
// export class servicePayWechat {
//     private readonly log = new Logger(this.constructor.name, { timestamp: true, })
//     private readonly notify_url: string = CPayWechatNotifyUrl;
//     async createTrade(
//         // openid: string, 小程序
//         platform: TPlatform,
//         itemName: string,
//         mount: number,
//         orderNo: string,
//         notify_url: string
//     ) {
//         // 截取前二十个字符
//         itemName = itemName.substring(0, 20);
//         let params = {
//             // openid,
//             body: itemName,
//             detail: itemName,
//             out_trade_no: orderNo,
//             total_fee: mount,
//             spbill_create_ip: "0.0.0.0",
//             notify_url: notify_url,
//         };
//         let wxpay = this.getWXPay(platform);
//         let ret = await new Promise((resolve, reject) => {
//             wxpay.getBrandWCPayRequestParams(params, function (err, result) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//         });
//         return ret;
//     }
//     /*--------------------- 辅助函数 ---------------------*/

//     private getWXPay(platform: TPlatform): any {
//         let { appID } = this.getAppID(platform)!;

//         let body = {
//             appid: appID,
//             mch_id: CPayWechat.appId,
//             partner_key: CPayWechat.mchId
//             //   pfx: fs.readFileSync(path.join(__dirname, "wxpay.p12")),
//         };
//         // return WXPay(body);
//     }

//     private getAppID(platform: TPlatform): WeChatPayParams | null {
//         switch (platform) {
//             case "H5":
//                 return { appID: CPayWechat.appId, appSecret: CPayWechat.appSecret }
//             default:
//                 return null
//         }
//     }
// }