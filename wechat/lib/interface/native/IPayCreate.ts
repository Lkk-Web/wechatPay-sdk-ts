

// https://api.mch.weixin.qq.com/v3/pay/transactions/native
export const PathPayCreate = 'pay/transactions/native'

// 应用ID	appid	string[1, 32]	是	body 由微信生成的应用ID，全局唯一。请求基础下单接口时请注意APPID的应用属性，例如公众号场景下，需使用应用属性为公众号的APPID
// 示例值：wxd678efh567hg6787
// 直连商户号	mchid	string[1, 32]	是	body 直连商户的商户号，由微信支付生成并下发。
// 示例值：1230000109
// 商品描述	description	string[1, 127]	是	body 商品描述
// 示例值：Image形象店 - 深圳腾大 - QQ公仔
// 商户订单号	out_trade_no	string[6, 32]	是	body 商户系统内部订单号，只能是数字、大小写字母_ -* 且在同一个商户号下唯一
// 示例值：1217752501201407033233368018
// 交易结束时间	time_expire	string[1, 64]	否	body 订单失效时间，遵循rfc3339标准格式，格式为yyyy - MM - DDTHH: mm: ss + TIMEZONE，yyyy - MM - DD表示年月日，T出现在字符串中，表示time元素的开头，HH: mm: ss表示时分秒，TIMEZONE表示时区（+08: 00表示东八区时间，领先UTC8小时，即北京时间）。例如：2015 - 05 - 20T13: 29: 35 + 08: 00表示，北京时间2015年5月20日 13点29分35秒。
// 订单失效时间是针对订单号而言的，由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。其他详见时间规则 。
// 建议：最短失效时间间隔大于1分钟
// 示例值：2018 - 06 - 08T10: 34: 56 + 08: 00
// 附加数据	attach	string[1, 128]	否	body 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用，实际情况下只有支付完成状态才会返回该字段。
// 示例值：自定义数据
// 通知地址	notify_url	string[1, 256]	是	body 通知URL必须为直接可访问的URL，不允许携带查询串，要求必须为https地址。
// 格式：URL
// 示例值：https://www.weixin.qq.com/wxpay/pay.php
// 订单优惠标记	goods_tag	string[1, 32]	否	body 订单优惠标记
// 示例值：WXG
//     + 订单金额	amount	object	是	body 订单金额信息
//         + 优惠功能	detail	object	否	body 优惠功能
//             + 场景信息	scene_info	object	否	body 支付场景描述
//                 - 结算信息	settle_info	object	否	body 结算信息

// https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml

export interface IPayCreateRes { code_url: string }