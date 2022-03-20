// https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_3.shtml


// https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/{out_trade_no}/close
// https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/{out_trade_no}/close

// 直连商户号	mchid	string[1, 32]	是	body 直连商户的商户号，由微信支付生成并下发。
// 示例值：1230000109
// 商户订单号	out_trade_no	string[6, 32]	是	path 商户系统内部订单号，只能是数字、大小写字母_ -* 且在同一个商户号下唯一
// 示例值：1217752501201407033233368018

export interface IPayCloseReq {
    mchid: string
}

export const PathPayClose = (out_trade_no: string) => `pay/transactions/out-trade-no/${out_trade_no}/close`