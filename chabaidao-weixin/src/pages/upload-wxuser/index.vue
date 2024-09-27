<template>
  <view class="user-avatar">
    <image :src="userInfo.avatar" mode="aspectFill" @click="uploadAvatar" />
  </view>
  <view class="user-nickname">
    <text>昵称</text>
    <input type="text" placeholder="请输入新的昵称" v-model="userInfo.nickname">
  </view>
  <button class="change-infor" @click="changeInfor">确认修改</button>
</template>

<script setup lang="ts">
import { request, uploadFileUrl } from '@/api/request'
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
  const userInfo = reactive({
    nickname:'',
    avatar:''
  })
  onLoad(() => {
    let getUserInfo = uni.getStorageSync('wxUserInfo') as {avatar:string, nickname:string}
    console.log(getUserInfo,'信息')
    if(getUserInfo) {
      userInfo.avatar = getUserInfo.avatar
      userInfo.nickname = getUserInfo.nickname
    }
  })

  // 上传头像
  function uploadAvatar(){
    uni.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success:res=>{
        uni.uploadFile({
          url: uploadFileUrl,
          name: 'file',
          filePath: res.tempFiles[0].tempFilePath,
          success:uploadRes=>{
              const imgUrl = JSON.parse(uploadRes.data) as {data:string}
              userInfo.avatar = imgUrl.data
          },
          fail:uploadErr=>{
              uni.showToast({title: '上传失败'});
          }
        })
      },
      fail:err=>{
          uni.showToast({title: '上传失败'});
      }
    })
  }

  // 修改头像昵称
  interface ForData{
    avatar:string,
    nickname:string
  }

  const changeInfor = async () => {
    uni.showLoading({title:'修改中',mask:true})
    const FormData:ForData ={
      avatar:userInfo.avatar,
      nickname:userInfo.nickname
    }
    await request('/uploadWxUser', FormData,'POST')
    let getUserInfo = uni.getStorageSync('wxUserInfo') as {avatar:string, nickname:string}
    getUserInfo.avatar = userInfo.avatar
    getUserInfo.nickname = userInfo.nickname
    uni.setStorageSync('wxUserInfo', getUserInfo)
    uni.hideLoading()
    uni.navigateBack({
      delta:1,
    })
  }

</script>

<style>
.user-avatar image{
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    margin: 35rpx auto;
}
.user-nickname{
    display: flex;
    align-items: center;
    padding: 20rpx;
}
.user-nickname input{
    flex: 1;
    padding: 20rpx;
    border-bottom: 1rpx solid #f6f6f6;
    margin-left: 15rpx;
}
.change-infor{
    padding: 20rpx 0;
    margin: 40rpx 20rpx 20rpx 20rpx;
    font-size: 30rpx;
    background-color: #214bd5;
    color: #ffffff;
}
</style>