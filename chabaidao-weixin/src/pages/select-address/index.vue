<template>
<text class="manage" @click="manageAddress = !manageAddress">{{ manageAddress ? '完成' : '管理' }}</text>
<view class="address-view" v-for="(item,index) in userAddress" :key="index">
  <view class="address-flex" @click="selectAddress(item)">
      <view class="select-address">
          <text>{{ item.address }}</text>
          <text class="user-detail-address">{{ item.detailedAddress }}</text>
          <view class="select-user">
              <text>{{ item.name }}</text>
              <text>{{ item.mobile }}</text>
          </view>
      </view>
      <text class="default-address" v-if="item.defaultAddress">默认</text>
  </view>
  <view class="address-flex setting" v-if="manageAddress">
      <text @click="setDefault(index,item._id)">设为默认</text>
      <text @click="deleteAddress(index,item._id)">删除</text>
  </view>
</view>
<button class="add-button" @click="subMit">添加地址</button>
<!-- 没有收货地址的提示 -->
<Tips :noData="noData" :tips="tips"></Tips>
</template>

<script setup lang="ts">
  import Tips from '../components/tips.vue'
  import { ref,watch } from 'vue'
  import type { Address } from '../../types/userinfo'
  import { onShow } from '@dcloudio/uni-app'
  import { request } from '../../api/request'
  
  const manageAddress = ref(false)
  const userAddress = ref<Address[]>([])
  onShow(async() => {
    const res = await request<Address[]>('/get-user-address')
    userAddress.value = res.data
  })

  interface Id {
    _id:string
  }
  // 设置默认地址
  const setDefault = async (index:number, _id:string) => {
    const queryId:Id ={_id}
    const res = await request('/set-default-address',queryId)
    console.log('haha',res)
    userAddress.value.forEach(item => item.defaultAddress = false)
    userAddress.value[index].defaultAddress = true
  }
  // 删除收货地址
  const deleteAddress = async (index:number, _id:string) => {
    const queryId:Id = {_id}
    await request('/delete-user-address',queryId)
    userAddress.value.splice(index,1)
  }
  // 添加新地址
  const subMit = () => {
    uni.navigateTo({
      url:'/pages/add-address/index'
    })
  }

  const noData = ref(false)
  const tips = ref('买个蛋，地址都没')
  watch(userAddress, (newVal) => {
    noData.value = newVal.length > 0 ? false :true
  },{deep:true})
  import { receiverAddress } from '@/store/index'
  const addressStore = receiverAddress()
  const selectAddress = (item:Address) => {
    addressStore.uploadAddress({
      address:item.address,
      detailedAddress:item.detailedAddress,
      mobile:item.mobile,
      name:item.name
    })
    uni.navigateBack({
      delta:1,
    })
  }


</script>

<style>
page{
    background-color: #f5f5f5;
 }
 .manage{
    text-align: right;
    padding: 20rpx 20rpx 0 0;
 }
 .address-view{
       background-color: #fefefe;
       padding: 0 20rpx;
       border-radius: 10rpx;
       margin: 20rpx;
       
 }
 .address-flex{
    display: flex;
    align-items: center;
    justify-content: space-between;
 }
 .address-view image{
    width: 40rpx;
 }
 .default-address{
    color: #777777;
 }
 .setting{
    padding: 20rpx 0;
    border-top: 1rpx solid #f2f2f2;
    color: #777777;
    font-size: 28rpx;
 }
</style>