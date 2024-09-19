<template>
    <!-- 底部购物车 -->
    <view class="to-checkout" v-if="cartData.paymentPrice > 0">
      <view class="product-quantity" @click="showCart = true">
        <text>{{ cartData.getCartCount }}</text>
        <image src="/static/gouwuche.png" mode="widthFix"/>
      </view>
      <view class="checkout-price">合计¥{{ cartData.paymentPrice }}</view>
      <button @click="gotoResult" v-if="pagePlaceOrder().orderType == '001'">去结算</button>
      <button 
        @click="gotoResult" 
        v-else 
        :disabled="cartData.paymentPrice < MerchanInfo().initialPrice"
      >
        {{ cartData.paymentPrice >= MerchanInfo().initialPrice ? '去结算' : `差¥${liftingPrice}起送` }}
      </button>
    </view>
  
  <!-- 遮罩层 -->
  <view class="popup-cart" v-show="showCart" @click="showCart = false"></view>
    
    <!-- 购物车里的详细商品 -->
    <view class="cart-shadow" v-show="showCart">
      <view class="delete-cart">
        <image src="/static/shanchu.png" mode="widthFix" @click="deleteGoods"/>
      </view>
  
      <!-- 每一个商品 -->
      <view class="item-cart-goods" v-for="(item,index) in cartData.cartItems" :key="index">
      <image class="item-goods-img" :src="item.goods_image" mode="aspectFill"/>
      <view class="item-goods-speci">
        <text>{{ item.goods_name }}</text>
        <text>{{ item.sku.length > 0 ? item.sku.join('/') : '' }}</text>
        <text>¥{{ item.goodsPrice }}</text>
      </view>
      <view class="select-goods single-goods">
        <image src="/static/jian-goods.png" mode="widthFix" @click="minusQuantity(index)"/>
        <text>{{ item.goodsQuantity }}</text>
        <image src="/static/jia-goods.png" mode="widthFix" @click="addQuantity(index)"/>
      </view>
    </view>
    </view>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { getCartStatus, pagePlaceOrder } from '@/store/index'
  import { MerchanInfo } from '@/api/menubutton'
  import { Decimal } from 'decimal.js'
  
  const cartStore = getCartStatus()
  
  // 计算购物车数据
  const cartData = computed(() => ({
    getCartCount: cartStore.getCartCount,
    paymentPrice: cartStore.paymentPrice,
    cartItems: cartStore.cartItems
  }))
  
  // 监听购物车中的商品数量，如果为0则删除
  watch(() => cartStore.cartItems, (newVal) => {
    cartStore.removeEmptyArrays()
    if (newVal.length <= 0) {
      deleteGoods()
    }
  }, { deep: true })
  
//   是否显示购物车
  const showCart = ref<boolean>(false)
  
  // 删除所有商品
  const deleteGoods = () => {
    cartStore.cartItems = []
    showCart.value = false
  }
  
  // 跳转到结算页面
  const gotoResult = () => {
    uni.navigateTo({
      url: '/pages/payment/index'
    })
  }
  
  // 计算还差多少钱起送
  const liftingPrice = computed(() => {
    const initialPrice = new Decimal(MerchanInfo().initialPrice)
    const nowPrice = new Decimal(cartData.value.paymentPrice)
    return Number(initialPrice.minus(nowPrice).toFixed(2))
  })
  
  // 减少商品数量
  const minusQuantity = (index: number) => {
    if (cartStore.cartItems[index].goodsQuantity > 0) {
      cartStore.$patch((val) => {
        val.cartItems[index].goodsQuantity--
        val.cartItems[index].totalPrice = new Decimal(val.cartItems[index].goodsQuantity).times(val.cartItems[index].goodsPrice).toNumber()
      })
    }
  }
  
  // 增加商品数量
  const addQuantity = (index: number) => {
    cartStore.$patch((val) => {
      val.cartItems[index].goodsQuantity++
      val.cartItems[index].totalPrice = new Decimal(val.cartItems[index].goodsQuantity).times(val.cartItems[index].goodsPrice).toNumber()
    })
  }
  </script>
  
<style >
     /* 底部购物车 */
.to-checkout{
  height: 110rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 0 20rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
}
.product-quantity{
  position: relative;
  width: 80rpx;
}
.product-quantity image{
  width: 80rpx;
}
.product-quantity text{
  font-size: 18rpx;
  position: absolute;
  top: 0;
  right: 0;
  color: #ffffff;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  border-radius: 50%;
  background-color: #8ad842;
}
.checkout-price{
  flex: 1;
  font-size: 35rpx;
  font-weight: bold;
  padding: 0 30rpx;
}
.to-checkout button{
  background-color: #214bd5;
  border-radius: 15rpx;
  color: #ffffff;
  font-size: 35rpx;
  padding: 15rpx 60rpx;
}
/* 弹出购物车 */
.popup-cart{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9;
  display: flex;
  align-items: flex-end;
}
.cart-shadow{
  position: fixed;
  bottom: 110rpx;
  left: 0;
  right: 0;
  background-color: #fefefe;
  width: 100%;
  max-height: 760rpx;
  overflow-y: auto;
  z-index: 99;
  animation: slide-up 0.3s ease;
}
@keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
}
.delete-cart{
  display: flex;
  justify-content:flex-end;
  padding: 20rpx;
}
.delete-cart image{
  width: 36rpx;
}
.item-cart-goods{
  display: flex;
  align-items: center;
  padding: 20rpx;
}
.item-goods-img{
  width: 130rpx;
  height: 130rpx;
  border-radius: 10rpx;
}
.item-goods-speci{
  flex: 1;
  padding: 0 15rpx;
  font-size: 28rpx;
}
.item-goods-speci text:nth-child(1){
  font-weight: bold;
}
.item-goods-speci text:nth-child(2){
  font-size: 25rpx;
  padding: 10rpx 0;
}
.item-goods-speci text:nth-child(3){
  font-weight: bold;
}
/* 打烊 */
.close-up-shop{
  background-color: #b8b8b8;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  height: 110rpx;
  line-height: 110rpx;
  z-index: 999;
}
</style>
  