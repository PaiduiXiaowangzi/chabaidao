export type UserInfo = {
    avatar:string,
    nickname:string,
    user_Token:string,
    _id:string
}

// 收货地址
export type Address = {
    address: string
    defaultAddress: boolean
    detailedAddress: string
    mobile: string
    name: string
    _id: string
}