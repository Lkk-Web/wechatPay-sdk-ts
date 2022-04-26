

// 商户退款单号	out_refund_no	string[1, 64]	是	path商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_ -|*@ ，同一退款单号多次请求只退一笔。
// 示例值：1217752501201407033233368018

// https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/{out_refund_no}
export const PathRefundQuery = (out_refund_no: string) => `refund/domestic/refunds/${out_refund_no}`

// 微信支付退款单号	refund_id	string[1, 32]	是	微信支付退款单号
// 示例值：50000000382019052709732678859
// 商户退款单号	out_refund_no	string[1, 64]	是	商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_ -|*@ ，同一退款单号多次请求只退一笔。
// 示例值：1217752501201407033233368018
// 微信支付订单号	transaction_id	string[1, 32]	是	微信支付交易订单号
// 示例值：1217752501201407033233368018
// 商户订单号	out_trade_no	string[1, 32]	是	原支付交易对应的商户订单号
// 示例值：1217752501201407033233368018
// 退款渠道	channel	string[1, 16]	是	枚举值：
// ORIGINAL：原路退款
// BALANCE：退回到余额
// OTHER_BALANCE：原账户异常退到其他余额账户
// OTHER_BANKCARD：原银行卡异常退到其他银行卡
// 示例值：ORIGINAL
// 退款入账账户	user_received_account	string[1, 64]	是	取当前退款单的退款入账方，有以下几种情况：
// 1）退回银行卡：{ 银行名称 } { 卡类型 } { 卡尾号 }
// 2）退回支付用户零钱: 支付用户零钱
// 3）退还商户: 商户基本账户商户结算银行账户
// 4）退回支付用户零钱通: 支付用户零钱通
// 示例值：招商银行信用卡0403
// 退款成功时间	success_time	string[1, 64]	否	退款成功时间，当退款状态为退款成功时有返回。
// 示例值：2020 - 12 - 01T16: 18: 12 + 08: 00
// 退款创建时间	create_time	string[1, 64]	是	退款受理时间
// 示例值：2020 - 12 - 01T16: 18: 12 + 08: 00
// 退款状态	status	string[1, 32]	是	款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，可前往商户平台 - 交易中心，手动处理此笔退款。
// 枚举值：
// SUCCESS：退款成功
// CLOSED：退款关闭
// PROCESSING：退款处理中
// ABNORMAL：退款异常
// 示例值：SUCCESS
// 资金账户	funds_account	string[1, 32]	否	退款所使用资金对应的资金账户类型
// 枚举值：
// UNSETTLED: 未结算资金
// AVAILABLE: 可用余额
// UNAVAILABLE: 不可用余额
// OPERATION: 运营户
// BASIC: 基本账户（含可用余额和不可用余额）
// 示例值：UNSETTLED
//     + 金额信息	amount	object	是	金额详细信息
//         + 优惠退款信息	promotion_detail	array	否	优惠退款信息

export interface IRefundQueryRes {
    refund_id: string
    out_refund_no: string
    transaction_id: string
    out_trade_no: string
    channel: 'ORIGINAL' | 'BALANCE' | 'OTHER_BALANCE' | 'OTHER_BANKCARD'
    user_received_account: string
    success_time?: string
    create_time: string
    status: 'SUCCESS' | 'CLOSED' | 'PROCESSING' | 'ABNORMAL'
    funds_account?: 'UNSETTLED' | 'AVAILABLE' | 'UNAVAILABLE' | 'OPERATION' | 'BASIC'
    amount: {
        total: number
        refund: number
    }
    from: {
        account: 'AVAILABLE' | 'UNAVAILABLE'
        amount: number
    }[]
    payer_total: number
    payer_refund: number
    settlement_refund: number
    settlement_total: number
    discount_refund: number
    currency: string
    promotion_detail: {
        promotion_id: string
        scope: string
        type: 'COUPON' | 'DISCOUNT'
        amount: number
        refund_amount: number
        goods_detail?: {
            merchant_goods_id: string
            wechatpay_goods_id?: string
            goods_name?: string
            unit_price: number
            refund_amount: number
            refund_quantity: number
        }[]
    }[]
}