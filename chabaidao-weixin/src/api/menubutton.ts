export const MenuButton = function() {
    const menuButton = uni.getStorageSync('MenuButton')
    const top = menuButton.top + 'px'
    const height = menuButton.height + 'px'
    const left = menuButton.left - 30 + 'px'
    const width = menuButton.width + 20 + 'px'
    const seViewHeight = menuButton.height + menuButton.top + 'px'
    return {
        top,
        height,
        left,
        width,
        seViewHeight
    }
}
// 商家信息接口
interface MerchanInfoType{
    address:string
    businessHours:string[]
    initialPrice:number
    location:number[]
    tradeName:string
    _id:string
}

// 获取本地缓存里的商家数据
export const MerchanInfo = function(){
    const {address,businessHours,initialPrice,location,
        tradeName,_id
    } = uni.getStorageSync('merchanInfo')
    const res:MerchanInfoType = {
        address,businessHours,initialPrice,location,
        tradeName,_id
    }
    return res
}