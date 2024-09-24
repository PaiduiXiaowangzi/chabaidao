<template>
  <view class="create-address">
    <view class="create-style">
        <text>联系人</text>
        <input type="text" placeholder="请填写收货人姓名" v-model="name">
    </view>
    <view class="create-style">
        <text>手机号</text>
        <input type="number" placeholder="请填写手机号" v-model="mobile">
    </view>
    <view class="create-style">
        <text>地址</text>
        <picker mode="region" @change="changeAddress">
            <view class="picker-address">
                <text>{{ address == '' ? '请选择地址' : address }}</text>
                <image src="/static/jiantou-right.png" mode="widthFix"/>
            </view>
        </picker>
    </view>
    <view class="create-style">
        <text>详细地址</text>
        <input type="text" placeholder="请填写详细地址" v-model="detailedAddress">
    </view>
  </view>
  <button class="add-button" @click="subMit">提交</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/api/request'

const name = ref('')//姓名
const mobile = ref('')//手机号
const address = ref('')//省市区地址
const detailedAddress = ref('')//详细地址

// 绑定picker数据
const changeAddress = (value:{detail:{value:string[]}}) =>{
    let str = ''
    value.detail.value.forEach(item =>str += item)
    address.value = str
}

interface FormData {
    name:string,
    mobile:string,
    address:string,
    detailedAddress:string
}

const subMit = async () => {
    const formData:FormData = {
        name:name.value,
        mobile:mobile.value,
        address:address.value,
        detailedAddress:detailedAddress.value
    }
    await request('/upload-address',formData,'POST')
    uni.navigateBack({
        delta:1,
    })
}




</script>

<style>
page{
    background-color: #f5f5f5;
}
.create-address{
    background-color: #fefefe;
    margin: 20rpx 0;
}
.create-address view{
    display: flex;
    align-items: center;
    padding: 30rpx 20rpx;
}
.create-address text{
    width: 180rpx;
}
.create-address image{
    width: 25rpx;
}
.create-address input{
    flex: 1;
}
.create-address picker{
    flex: 1;
}
.picker-address{
    padding: initial !important;
}
.picker-address text{
    width: 0 !important;
    flex: 1;
}
</style>