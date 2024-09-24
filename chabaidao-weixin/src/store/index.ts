import { defineStore } from 'pinia'
import type { CartItem } from '@/types/cart'
import  Decimal from 'decimal.js'

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const getCartStatus = defineStore('shoppingcart', {
  // 其他配置...
  state:() =>({
    cartItems:[] as CartItem[]
  }),
  getters:{
    paymentPrice():number{
      const res = this.cartItems.reduce((subtotal,goodsItem) => subtotal + goodsItem.totalPrice,0)
      return Number(new Decimal(res).toFixed(2))
    },
    getCartCount():number{
      const res = this.cartItems.reduce((subtotal,goodsItem) => subtotal + goodsItem.goodsQuantity,0)
      return res
    }
  },
  actions: {
    addCart(item:CartItem)  {
        const existingItem = this.cartItems.find((cartItem) => {
            return cartItem.goods_id === item.goods_id && cartItem.sku_id === item.sku_id
        })
        if(existingItem) {
            if(item.homePage) {
                existingItem.goodsQuantity = item.goodsQuantity
            }else {
                existingItem.goodsQuantity += item.goodsQuantity
            }
            const price = new Decimal(existingItem.goodsPrice)
            const quantity = new Decimal(existingItem.goodsQuantity)
            const totalPrice = Number((price.times(quantity)).toString())
            existingItem.totalPrice = totalPrice
        }else {
            const price = new Decimal(item.goodsPrice)
            const quantity = new Decimal(item.goodsQuantity)
            const totalPrice = Number((price.times(quantity)).toString())
            item.totalPrice = totalPrice
            this.cartItems.push(item)
        }
    },
    // 找出购物车里数量为零的商品并删除他
    removeEmptyArrays() {
      this.cartItems.forEach((item,index) => {
        if(item.goodsQuantity === 0) {
          this.cartItems.splice(index,1)
        }
      })
    }
  }
})

// 存储用户选择的下单类型
export const pagePlaceOrder = defineStore('pagePlaceOrder', {
  state:() =>({
    orderType:'002'
  })
})

// 点击首页轮播图推荐商品到点单页面，找到商品下单
interface GoodsId {
  categoryId:string,
  goodsId:string
}


export const pageGoodsId = defineStore('pageGoodsId',{
  state:() => ({
    goodsId:[] as GoodsId[]
  }),
  actions: {
    uploadGoodsId(item:GoodsId) {
      this.goodsId = [item]
    }
  }
})

import type { ReceiverAddress } from '@/types/cart'
export const receiverAddress = defineStore('receiverAddress',{
  state:() =>({
    addressItems:[] as ReceiverAddress[]
  }),
  actions:{
    uploadAddress(item:ReceiverAddress){
      this.addressItems = [item]
    }
  }
})