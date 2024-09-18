import { defineStore } from 'pinia'
import type { CartItem } from '@/types/cart'
import  Decima from 'decimal.js'

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const getCartStatus = defineStore('shoppingcart', {
  // 其他配置...
  state:() =>({
    cartItems:[] as CartItem[]
  }),
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
            const price = new Decima(existingItem.goodsPrice)
            const quantity = new Decima(existingItem.goodsQuantity)
            const totalPrice = Number((price.times(quantity)).toString())
            existingItem.totalPrice = totalPrice
        }else {
            const price = new Decima(item.goodsPrice)
            const quantity = new Decima(item.goodsQuantity)
            const totalPrice = Number((price.times(quantity)).toString())
            item.totalPrice = totalPrice
            this.cartItems.push(item)
        }
    }
  }
})