import { IPayQueryRes } from './IPayQuery';

// 通知ID	id	string[1, 36]	是	通知的唯一ID
// 示例值：EV - 2018022511223320873
// 通知创建时间	create_time	string[1, 32]	是	通知创建的时间，遵循rfc3339标准格式，格式为yyyy - MM - DDTHH: mm: ss + TIMEZONE，yyyy - MM - DD表示年月日，T出现在字符串中，表示time元素的开头，HH: mm: ss.表示时分秒，TIMEZONE表示时区（+08: 00表示东八区时间，领先UTC 8小时，即北京时间）。例如：2015 - 05 - 20T13: 29: 35 + 08: 00表示北京时间2015年05月20日13点29分35秒。
// 示例值：2015 - 05 - 20T13: 29: 35 + 08: 00
// 通知类型	event_type	string[1, 32]	是	通知的类型，支付成功通知的类型为TRANSACTION.SUCCESS
// 示例值：TRANSACTION.SUCCESS
// 通知数据类型	resource_type	string[1, 32]	是	通知的资源数据类型，支付成功通知为encrypt - resource
// 示例值：encrypt - resource
//     + 通知数据	resource	object	是	通知资源数据
// json格式，见示例
// 回调摘要	summary	string[1, 64]	是	回调摘要
// 示例值：支付成功


export interface IPayCallback {
    id: string
    create_time: string
    event_type: string
    resource_type: string
    resource: {
        algorithm: 'AEAD_AES_256_GCM'
        ciphertext: string,
        associated_data?: string
        nonce: string
        original_type: string
    },
    summary: string
}

export interface IPayCallbackData extends IPayQueryRes {
    transaction_id: string
    amount: {
        total: number
        payer_total: number
        currency: string
        payer_currency: string
    }
}

export const ReturnData = { code: "SUCCESS", message: "成功" }