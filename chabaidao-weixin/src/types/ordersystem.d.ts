export type Distance = {
    distance:string
}

// 子属性
export type SubAttribute = {
    disable: boolean
    name:string
    selected:string
    statesId:string
    _id:string
}

// 父属性
export type GoodsStat = {
    disable:boolean
    name:string
    selected:string
    _id:string
    subAttributes:SubAttribute[]
}

// 每个商品详情
export type Category = {
    category_id: string
    goods_describe:string
    goods_image:string
    goods_name:string
    goods_price:number
    goods_stock:number
    quantity:number
    sales_valume:number
    _id:string
    goods_stats: GoodsStat[]
}

// 分类和商品
export type AllGoods = {
    categoryName:string
    icon:string
    _id:string
    category:Category[]
}
// 商品sku列表
export type GoodsSku = {
    goods_id: string
    price: number
    stock: number
    _id: string
    skuId:string[]
    specs:string[]
}