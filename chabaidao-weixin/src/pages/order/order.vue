<template>
    <view class="my-order" v-for="(item,index) in orderDataList" :key="index" @click="skip(item._id)">
      <view class="order-type">
          <text>{{ item.orderType == '001' ? '自提' : '外卖' }}</text>
          <text>{{ item.productOrderCount }}个商品</text>
      </view>
      <view class="item-order">
          <block v-for="(item_a,index_a) in item.productOrder" :key="index_a">
              <image :src="item_a.goods_image" mode="aspectFill"/>
              <view class="order-speci">
                  <text>{{ item_a.goods_name }}</text>
                  <text>{{ item_a.sku.length > 0 ? item_a.sku.join('/') : '' }}</text>
                  <text>x{{ item_a.goodsQuantity }}</text>
              </view>
          </block>
          <view class="order-price">¥{{ item.paymentPrice }}</view>
      </view>
    </view>
</template>

<script lang="ts" setup>
  import{ request } from '@/api/request'
  import type { UserOrderList } from '@/types/cart'
  import { ref } from 'vue'
  import { onShow, onReachBottom } from "@dcloudio/uni-app";
  interface Formdata{page:number}
  const page = ref(1)
  const orderDataList = ref<UserOrderList[]>([])
//   开局先搞点数据用用
  onShow( async () => {
    page.value = 1
    orderDataList.value = []
    orderList()
  })
//   获取数据逻辑
  const orderList = async() => {
    const FormData:Formdata = {
        page:page.value
    }
    const res = await request<UserOrderList[]>('/all-order-list',FormData)
    orderDataList.value = [...orderDataList.value,...res.data]
  }
//   触底逻辑
  onReachBottom(() => {
    page.value ++
    orderList()
  })
//   跳转到订单详情页
const skip = (id:string) => {
    uni.navigateTo({
        url:'/pages/order-details/index?id=' +id
    })
}  


</script>

<style >
  page{
      background-color: #f6f6f6;
  }
  .my-order{
      background-color: #ffffff;
      border-radius: 10rpx;
      margin: 20rpx;
  }
  .order-type{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 27rpx;
  }
  .order-type text:nth-child(1){
      background-color: #234ad5;
      padding: 5rpx 15rpx;
      color: #fff;
      display: inline-block;
  }
  .order-type text:nth-child(2){
      padding-right: 20rpx;
      color: #949494;
  }
</style>