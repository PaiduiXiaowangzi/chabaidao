export type CartItem = {
    fatherId:string//父级id，分类
    sonId:string//子集id，商品
    goods_name:string//商品名称
    goods_image:string//商品图片
    goods_id:string//商品id
    goodsPrice:number//商品单价
    goodsQuantity:number//商品数量
    totalPrice:number//商品总价
    sku:string[]//sku属性
    skuIdArr:string[]//skuid
    sku_id:string//sku对象唯一id
    homePage?:boolean//判断是否是从商品列表页提交的无规格商品
}

// 确认订单页面用户选择的收货地址
export type ReceiverAddress = {
    address: string
    detailedAddress: string
    mobile: string
    name: string
}