
export interface WeChatPayParams {
    appID?: string;
    appSecret?: string;
}
export type TTradeType = 'transaction_id' | 'out_trade_no'
export interface ITradeType {
    transaction_id?: string
    out_trade_no?: string
}

