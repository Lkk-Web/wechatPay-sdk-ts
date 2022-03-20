export interface IPayCreateReq {
    appid: string
    mchid: string
    description: string
    out_trade_no: string
    time_expire?: string
    attach?: string
    notify_url: string
    goods_tag?: string
    amount: {
        total: number
        currency?: string
    }
    detail?: {
        cost_price?: number
        invoice_id?: string
        goods_detail?: {
            merchant_goods_id: string
            wechatpay_goods_id?: string
            goods_name?: string
            quantity: number
            unit_price: number
        }[]
    }
    scene_info?: ISceneInfo
    settle_info?: {
        profit_sharing?: boolean
    }
}


//H5下单接口
export interface ISceneInfo {
    payer_client_ip: string
    device_id?: string
    store_info?: {
        id: string
        name?: string
        area_code?: string
        address?: string
    }
}