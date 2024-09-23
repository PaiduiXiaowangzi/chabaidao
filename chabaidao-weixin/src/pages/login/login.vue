<template>
<view class="login-view">
  <image
    src="https://chabaidao66.oss-cn-guangzhou.aliyuncs.com/chabaidao661726888868258954.png"
    mode="widthFix"
  />
  <button @click="wxLogin">一键登录</button>
</view>
</template>

<script setup lang="ts">
import { request } from '@/api/request'
import type { UserInfo } from '@/types/userinfo'

const wxLogin = () => {
  uni.showLoading({title:'登录中',mask:true})
  uni.login({
    success:async(res)=>{
      const userData = await request<UserInfo>('/wxlogin',{code:res.code})
      uni.setStorageSync('wxUserInfo',userData.data)
      uni.navigateBack({
        delta:1
      })
      uni.hideLoading()
    },
  })
}
</script>

<style>
.login-view{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  top: 0;
}
.login-view image{
    width: 150rpx;
    border-radius: 50%;
    margin-bottom: 90rpx;
}
.login-view button{
    padding: 20rpx 180rpx;
    background-color: #214bd5;
    color: #ffffff;
    font-size: 30rpx;
}
</style>