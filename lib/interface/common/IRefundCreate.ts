import { ITradeType } from "./IPayBase"



// https://api.mch.weixin.qq.com/v3/refund/domestic/refunds
export const PathRefundCreate = 'refund/domestic/refunds'


// 微信支付订单号	transaction_id	string[1, 32]	二选一	body原支付交易对应的微信订单号
// 示例值：1217752501201407033233368018
// 商户订单号	out_trade_no	string[6, 32]	body原支付交易对应的商户订单号
// 示例值：1217752501201407033233368018
// 商户退款单号	out_refund_no	string[1, 64]	是	body商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_ -|*@ ，同一退款单号多次请求只退一笔。
// 示例值：1217752501201407033233368018
// 退款原因	reason	string[1, 80]	否	body若商户传入，会在下发给用户的退款消息中体现退款原因
// 示例值：商品已售完
// 退款结果回调url	notify_url	string[8, 256]	否	body异步接收微信支付退款结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。 如果参数中传了notify_url，则商户平台上配置的回调地址将不会生效，优先回调当前传的这个地址。
// 示例值：https://weixin.qq.com
// 退款资金来源	funds_account	string[1, 32]	否	body若传递此参数则使用对应的资金账户退款，否则默认使用未结算资金退款（仅对老资金流商户适用）
// 枚举值：
// AVAILABLE：可用余额账户
// 示例值：AVAILABLE
//     + 金额信息	amount	object	是	body订单金额信息
//         + 退款商品	goods_detail	array	否	body指定商品退款需要传此参数，其他场景无需传递


export interface IRefundCreateConfig1 {
    transaction_id: string
}
export interface IRefundCreateConfig2 {
    out_trade_no: string
}

export interface IRefundCreateReq extends ITradeType {
    out_refund_no: string
    reason?: string
    notify_url?: string
    funds_account?: string
    amount: {
        refund: number
        from?: {
            account: 'AVAILABLE' | 'UNAVAILABLE'
            amount: number
        }[]
        total: number
        currency: string
    }
    goods_detail?: {
        merchant_goods_id: string
        wechatpay_goods_id?: string
        goods_name?: string
        unit_price: number
        refund_amount: number
        refund_quantity: number
    }[]
}
