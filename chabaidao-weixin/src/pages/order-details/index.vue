<template>
  <view class="pay-view order-type">
    <text class="order-state" v-for="(item,index) in orderDetails" :key="index">
        {{ item.orderType === '001' ? `取餐码${item.takeMealCode}` : '该订单由商家自配' }}
    </text>
  </view>
  <view class="pay-view" v-for="(item,index) in orderDetails" :key="index">
    <view class="merchant-address">
        <text>{{ MerchanInfo().tradeName }}</text>
        <image src="/static/daohang.png" mode="widthFix" @click="openLocation"/>
    </view>
    <view class="item-order" v-for="(item_a,index_a) in item.productOrder" :key="index_a">
        <image :src="item_a.goods_image" mode="aspectFill"/>
        <view class="order-speci">
            <text>{{ item_a.goods_name }}</text>
            <text>{{ item_a.sku.length > 0 ? item_a.sku.join('/') : '' }}</text>
            <text>x{{ item_a.goodsQuantity }}</text>
        </view>
        <view class="order-price">¥{{ item_a.totalPrice }}</view>
    </view>
    <view class="total">
        <text>合计：¥{{ item.paymentPrice }}</text>
    </view>
  </view>
  <!-- 订单信息 -->
  <view class="pay-view">
    <view class="order-info" v-for="(item,index) in orderInfo" :key="index">
        <text>{{ item.way }}</text>
        <view v-if="!Array.isArray(item.details)">
            <text>{{ item.details }}</text>
        </view>
        <view v-else v-for="(item_a,index_a) in item.details" :key="index_a">
            <text>{{ item_a.address }}</text>
            <text>{{ item_a.detailedAddress }}</text>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { MerchanInfo } from '@/api/menubutton'
import { request } from '@/api/request'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { UserOrderDetails } from '@/types/cart' 

const orderDetails = ref<UserOrderDetails[]>([])
interface OrderInfo{
    way:string,
    details:string | number | {address:string, detailedAddress:string}[]
}

const orderInfo = ref<OrderInfo[]>([])
interface FormData{id:string}
onLoad(async(event) => {
    const id = event?.id
    // console.log('id:',id)
    const fromData:FormData = {id}
    const res = await request<UserOrderDetails[]>('/order-details',fromData)
    orderDetails.value = res.data
    if(res.data[0].orderType === '001') {
        orderInfo.value = [
            {
                way:'订单类型',
                details:'到店取餐'
            },
            {
                way:'取餐码',
                details:res.data[0].takeMealCode
            },
        ]
    }else {
        orderInfo.value =[
            {
                way:'订单类型',
                details:'外卖到家'
            },
            {
                way:'收货地址',
                details:res.data[0].receiverAddress
            },
        ]
    }
    orderInfo.value.push(
        {
            way:'下单时间',
            details:res.data[0].orderTime
        },
        {
            way:'订单号',
            details:res.data[0].orderNumber
        },
    )
})

const openLocation = () => {
    uni.openLocation({
        latitude:MerchanInfo().location[1],
        longitude:MerchanInfo().location[0],
        name:MerchanInfo().tradeName,
        address:MerchanInfo().address,
    })
}


</script>

<style>
page{
    background-color: #f5f5f5;
}
.order-type{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.order-state{
    font-size: 35rpx;
    font-weight: bold;
    padding: 60rpx 0;
}
.order-pay{
    display: flex;
    align-items: center;
    padding: 20rpx 0;
}
.order-pay text{
    padding: 10rpx 25rpx;
    border-radius: 10rpx;
    margin: 0 20rpx;
}
.order-pay text:nth-child(1){
    border: 1rpx solid #d2d2d2;
}
.order-pay text:nth-child(2){
    background-color: #73dad2;
    color: #ffffff;
}
.merchant-address{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f2f2f2;
    font-size: 35rpx;
    font-weight: bold;
}
.merchant-address image{
    width: 40rpx;
}
.item-order{
    padding: 20rpx 0 !important;
}
.total{
    display: flex;
    justify-content: flex-end;
    border-top: 1rpx solid #f2f2f2;
    padding: 20rpx 0;
    font-size: 35rpx;
    font-weight: bold;
}
.order-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f2f2f2;
}
.order-info view{
    text-align: end;
}
</style>