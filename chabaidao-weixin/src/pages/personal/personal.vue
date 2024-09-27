<template>
  <view class="userinfo-top">
    <image :src="userInfo.avatar" mode="aspectFill"/>
    <text v-if="userInfo.nickname != ''">{{ userInfo.nickname }}</text>
    <text v-else @click="goLogin">登录后获取更多服务</text>
  </view>
  <view class="my-service">
    <view v-for="(item,index) in service" :key="index" @click="serviceDetail(index)">
        <image :src="item.icon" mode="widthFix"/>
        <text>{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'

  const userInfo = reactive({
    nickname:'',
    avatar:''
  })
  onShow(() => {
    let getUserInfo = uni.getStorageSync('wxUserInfo') as { avatar:string, nickname:string }
    if(getUserInfo) {
      userInfo.avatar = getUserInfo.avatar
      userInfo.nickname = getUserInfo.nickname
    }
  })
  const goLogin = () => {
    uni.navigateTo({
      url:'/pages/login/index',
    })
  }
  const serviceDetail = (index:number) => {
    if(index === 0){
      uni.navigateTo({
          url:'/pages/upload-wxuser/index'
      })
    }else if(index === 1){
      uni.navigateTo({
          url:'/pages/customer-service/index'
      })
    }else if(index === 2){
      uni.navigateTo({
          url:'/pages/select-address/index'
      })
    }else{
      uni.showToast({
          title:'敬请期待',
          icon:'none'
      })
    }
  }



  // 服务列表
  const service = ref([
    {
      icon:'/static/personal/ziliao.png',
      text:'个人资料'
    },
    {
      icon:'/static/personal/kefu.png',
      text:'联系客服'
    },
    {
      icon:'/static/personal/dizhi.png',
      text:'收货地址'
    },
    {
      icon:'/static/personal/fuli.png',
      text:'社群福利'
    },
    {
      icon:'/static/personal/jiameng.png',
      text:'加盟申请'
    },
    {
      icon:'/static/personal/huizhang.png',
      text:'我的徽章'
    },
    {
      icon:'/static/personal/liping.png',
      text:'礼品卡'
    },
    {
      icon:'/static/personal/liquan.png',
      text:'礼券兑换'
    }
  ])
</script>

<style >
  .userinfo-top{
    background-color: #e2eafd;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 50rpx 0;
  }
  .userinfo-top image{
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    margin-bottom: 20rpx;
  }
  .userinfo-top text{
    font-size: 32rpx;
    font-weight: bold;
  }
  .my-service {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 6rpx;
  }
  .my-service view{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 27rpx;
    padding: 25rpx 0;
  }
  .my-service image{
    width: 50rpx;
    margin-bottom: 10rpx;
  }
</style>