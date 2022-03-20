


// 直连商户号	mchid	string[1, 32]	是	query 直连商户的商户号，由微信支付生成并下发。
// 示例值：1230000109
// 微信支付订单号	transaction_id	string[1, 32]	是	path 微信支付系统生成的订单号
// 示例值：1217752501201407033233368018

import { ITradeType } from "./IPayBase"


// 直连商户号	mchid	string[1, 32]	是	query 直连商户的商户号，由微信支付生成并下发。
// 示例值：1230000109
// 商户订单号	out_trade_no	string[6, 32]	是	path 商户系统内部订单号，只能是数字、大小写字母_ -* 且在同一个商户号下唯一。
// 特殊规则：最小字符长度为6
// 示例值：1217752501201407033233368018

export interface IPayQueryReq extends ITradeType{
    mchid: string
    // // 这两个字段二选一，怎么设计呢？
    // transaction_id?: string
    // out_trade_no?: string
}



// 应用ID	appid	string[1, 32]	是	直连商户申请的公众号或移动应用appid。
// 示例值：wxd678efh567hg6787
// 直连商户号	mchid	string[1, 32]	是	直连商户的商户号，由微信支付生成并下发。
// 示例值：1230000109
// 商户订单号	out_trade_no	string[6, 32]	是	商户系统内部订单号，只能是数字、大小写字母_ -* 且在同一个商户号下唯一，详见【商户订单号】。
// 示例值：1217752501201407033233368018
// 微信支付订单号	transaction_id	string[1, 32]	否	微信支付系统生成的订单号。
// 示例值：1217752501201407033233368018
// 交易类型	trade_type	string[1, 16]	否	交易类型，枚举值：
// JSAPI：公众号支付
// NATIVE：扫码支付
// APP：APP支付
// MICROPAY：付款码支付
// MWEB：H5支付
// FACEPAY：刷脸支付
// 示例值：MICROPAY
// 交易状态	trade_state	string[1, 32]	是	交易状态，枚举值：
// SUCCESS：支付成功
// REFUND：转入退款
// NOTPAY：未支付
// CLOSED：已关闭
// REVOKED：已撤销（仅付款码支付会返回）
// USERPAYING：用户支付中（仅付款码支付会返回）
// PAYERROR：支付失败（仅付款码支付会返回）
// 示例值：SUCCESS
// 交易状态描述	trade_state_desc	string[1, 256]	是	交易状态描述
// 示例值：支付成功
// 付款银行	bank_type	string[1, 32]	否	银行类型，采用字符串类型的银行标识。银行标识请参考《银行类型对照表》
// 示例值：CMC
// 附加数据	attach	string[1, 128]	否	附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用
// 示例值：自定义数据
// 支付完成时间	success_time	string[1, 64]	否	支付完成时间，遵循rfc3339标准格式，格式为yyyy - MM - DDTHH: mm: ss + TIMEZONE，yyyy - MM - DD表示年月日，T出现在字符串中，表示time元素的开头，HH: mm: ss表示时分秒，TIMEZONE表示时区（+08: 00表示东八区时间，领先UTC 8小时，即北京时间）。例如：2015 - 05 - 20T13: 29: 35 + 08: 00表示，北京时间2015年5月20日 13点29分35秒。
// 示例值：2018 - 06 - 08T10: 34: 56 + 08: 00
//     + 支付者	payer	object	是	支付者信息
//         + 订单金额	amount	object	否	订单金额信息，当支付成功时返回该字段。
// +场景信息	scene_info	object	否	支付场景描述
//     + 优惠功能	promotion_detail	array	否	优惠功能，享受优惠时返回该字段。

export interface IPayQueryRes {
    appid: string
    mchid: string
    out_trade_no: string
    transaction_id?: string
    trade_type?: 'JSAPI' | 'NATIVE' | 'APP' | 'MICROPAY' | 'MWEB' | 'FACEPAY'
    trade_state: 'SUCCESS' | 'REFUND' | 'NOTPAY' | 'CLOSED' | 'REVOKED' | 'USERPAYING' | 'PAYERROR'
    trade_state_desc: string
    bank_type?: string
    attach?: string
    success_time?: string
    payer: {
        openid: string
    }
    amount?: {
        total?: number
        payer_total?: number
        currency?: string
        payer_currency?: string
    }
    scene_info?: {
        device_id?: string
    }
    promotion_detail?: {
        coupon_id: string
        name?: string
        scope?: string
        type?: 'CASH' | 'NOCASH'
        amount: number
        stock_id?: string
        wechatpay_contribute?: number
        merchant_contribute?: number
        other_contribute?: number
        currency?: string
        goods_detail?: {
            goods_id: string
            quantity: number
            unit_price: number
            discount_amount: number
            goods_remark?: string
        }
    }
}




// https://api.mch.weixin.qq.com/v3/pay/transactions/id/{transaction_id}
// https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/{out_trade_no}
export const PathPayQueryID = (transaction_id: string) => `pay/transactions/id/${transaction_id}`
export const PathPayQueryTrade = (out_trade_no: string) => `pay/transactions/out-trade-no/${out_trade_no}`