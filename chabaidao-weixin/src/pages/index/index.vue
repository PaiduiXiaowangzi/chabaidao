<template>
    <view class="swiper-view">
      <swiper class="swiper-img" autoplay circular :current="currentIndex" @change="changeCurrent">
        <swiper-item v-for="(item, index) in swiperList" :key="item">
          <image
            :src="item.carouselImages"
            mode="aspectFill"
          />
        </swiper-item>
      </swiper>
      <!-- 指示点的滚动 -->
      <view class="indicator">
        <text v-for="(item,index) in swiperList" :key="index" :class="{'select-text':index == currentIndex}"></text>
      </view>
    </view>
    <!-- 到店自取和外卖选择 -->
    <view class="buy-btn">
        <view v-for="(item,index) in orderAction" :key="index">
            <image
                :src="item.icon"
                mode="widthFix"
            />
            <text>{{ item.title }}</text>
        </view>
    </view>
    <!-- 下方装饰横栏 -->
     <view class="advertisement">
        <image
            v-for="(item, index) in adAction"
            :key="index"
            :src="item"
            mode="aspectFill"
        />
     </view>
  </template>
  
<script setup lang="ts">
import type {SwiperItem} from '@/types/indext'
import {ref} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import { request } from '@/api/request'
onLoad(async() => {
  const res = await request<SwiperItem[]>('/get-swiper')
  swiperList.value = res.data
})

// 顶部轮播图
const swiperList = ref<SwiperItem[]>([])

// 自定义指示点的滚动下标值
const currentIndex = ref(0)
const changeCurrent = (event:{detail:{current:number}}) => {
// console.log(event)
currentIndex.value = event.detail.current
}

//  到店自取和外卖选择
const orderAction = ref([
    {
        'icon':'/static/daodian.png',
        'title':'到店自取',
        'orderType':'001'
    },
    {
        'icon':'/static/waimai.png',
        'title':'外卖配送',
        'orderType':'002'
    }
])
// 下方装饰横栏
const adAction = ref([
  'http://ge.thexxdd.cn/kecheng-chabaidao/banner001.jpg',
  'http://ge.thexxdd.cn/kecheng-chabaidao/banner002.jpg'
])
</script>
  
  <style scoped>
  page{
    background-color: #f1f1f1;
  }
  .swiper-view{
    height: 800rpx;
    position: relative;
  }
  .swiper-img, image{
    height: 800rpx;
    width: 100%;
  }
  .indicator{
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 20rpx;
    left: 35rpx;
  }
  .indicator text{
    width: 35rpx;
    height: 8rpx;
    background: aqua;
    border-radius: 6rpx;
    margin: 5rpx;
  }
  .select-text{
    background: chartreuse !important;
  }
  /* 到店自取，外卖 */
  .buy-btn{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .buy-btn view{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fefefe;
    border-radius: 30rpx;
    width: 50%;
    height: 260rpx;
    margin: 20rpx;
  }
  .buy-btn image{
    width: 150rpx;
  }
  .buy-btn text{
    font-size: 37rpx;
    font-weight: bold;
    padding-top: 10rpx;
  }
  /* 广告 */
  .advertisement{
    margin: 20rpx;
  }
  .advertisement image{
    width: 100%;
    height: 220rpx;
    border-radius: 10rpx;
    display: block;
    margin: 20rpx 0;
  }
  </style>