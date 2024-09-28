<template>
  <view class="messag-content">
    <block v-for="(item,index) in messageData" :key="index">
      <!-- 管理员 -->
      <view class="message msg-left" v-if="item.messagetype == '001'">
        <image :src="item.avatar" mode="aspectFill"/>
        <text>{{ item.message }}</text>
      </view>
      <!-- 自己发的 -->
      <view class="message msg-right" v-else>
        <text>{{ item.message }}</text>
        <image :src="item.avatar" mode="aspectFill"/>
      </view>
    </block>
  </view>
  <view style="height: 300rpx;"></view>
  <!-- 输入框 -->
  <view class="Input_field">
    <input 
    type="text"
    placeholder="输入消息"
    maxlength="-1"
    cursor-spacing="40"
    confirm-type="send"
    @confirm="sendMessage"
    v-model="userMessage"
    >
    <image src="/static/fasong.png" mode="aspectFit" @click="sendMessage"/>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { onShow } from '@dcloudio/uni-app'
  import { BaseUrl } from '../../api/request'

  const io = require('../../api/weapp.socket.io')
  import type { UserInfo, MessageData } from '../../types/userinfo'
  import { Base64 } from 'js-base64'
  const socketObj = ref()
  // 存储聊天
  const messageData = ref<MessageData[]>([])

  onShow(() => {
    socketObj.value = io(BaseUrl,{
      transports: ['websocket'],
          query:{
            authorization:userInfo().token,
            clientType:'USER',
            userid:userInfo().id
          },
          reconnectionAttempts:4,//失败后重新连接次数，一直失败总共尝试四次
          reconnectionDelay:2000,//重新连接间隔时间毫秒
    })
        // 连接成功返回
    socketObj.value.on('connect',()=>{
      console.log('连接成功');
    })
    // 重新连接失败
    socketObj.value.on('reconnect_failed',()=>{
      console.log('重新连接失败');
    })
    // 正在重新连接
    socketObj.value.on('reconnect_attempt',()=>{
      console.log('正在重新连接');
    })
    // 监听连接发生错误
    socketObj.value.on('error',(err:any)=>{
      console.log('连接发生错误');
      if(err === '401'){
        uni.navigateTo({url:'/pages/login/index'})
      }
    })
    // 接收服务器端返回的消息:管理员发来的消息
    socketObj.value.on('wxchat',(data:MessageData)=>{
      console.log(data);
      messageData.value.push(data)
    })
  })
    // 发送消息
  const userMessage = ref('')
  const sendMessage = () =>{
    if(userMessage.value.trim() == '')return
    let msgObj:MessageData = {
      avatar: userInfo().avatar,
      message: userMessage.value,
      messagetype: "002",
      nickname: userInfo().nickname,
      userid: userInfo().id
    }
    socketObj.value.emit('userMessage',msgObj)
    messageData.value.push(msgObj)
    userMessage.value = ''
    uni.pageScrollTo({scrollTop:3000})
  }

  
  // 获取本地缓存用户信息
  const userInfo = () => {
    let user = uni.getStorageSync('wxUserInfo') as UserInfo;
    const base64Toekn = Base64.encode(user.user_Token + ':')
    return {
      token:'Basic ' + base64Toekn,
      id:user._id,
      avatar:user.avatar,
      nickname:user.nickname
    }
  }

</script>

<style>
    page{
    background-color: #eaeaea;
}
.messag-content{
    display: flex;
    flex-direction: column;
    padding: 20rpx;
}
.message{
    display: flex;
    align-items: center;
    margin: 20rpx 0;
}
.message image{
    width: 65rpx;
    height: 65rpx;
    border-radius: 10rpx;
}
.message text{
    border-radius: 10rpx;
    padding: 10rpx;
}
.msg-right{
    align-self: flex-end;
}
.msg-left{
    padding-right: 150rpx;
}
.msg-right{
    padding-left: 150rpx;
}
.msg-left text{
    background-color: #ffffff;
    margin-left: 10rpx;
}
.msg-right text{
    background-color: #304bcc;
    color: #ffffff;
    margin-right: 10rpx;
}
/* 固定在底部的输入框样式 */
.Input_field{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #eee;
    padding: 10rpx 20rpx 70rpx 20rpx;
    background-color: #f6f6f6;
}
/* 固定在底部的输入框input样式 */
.Input_field input{
    width: 100%;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
}
/* 固定在底部的输入框左右两边清空和发送样式 */
.Input_field image{
    height: 70rpx;
    width: 70rpx;
    margin-left: 20rpx;
}
</style>