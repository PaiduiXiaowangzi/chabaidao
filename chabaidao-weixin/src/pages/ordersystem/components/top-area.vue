<template>
    <view class="search-view">
      <view :style="{'height':MenuButton().top}"></view>
      <view class="search-input">
        <image src="/static/sousuo.png" mode="widthFix"/>
        <input placeholder="搜索商品" placeholder-class="input-color" disabled/>
      </view>
      <view class="merchant-store">
        <view class="address-view">
          <image src="/static/xing.png" mode="widthFix"/>
          <text></text>
          <text></text>
        </view>
        <view class="distance-view">
          <image src="/static/weizhi.png" mode="widthFix"/>
          <text>商家距离你</text>
        </view>
      </view>
    </view>
    <view :style="{'height':spacingHeight}"></view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { MenuButton } from '@/api/menubutton'
import {onLoad} from '@dcloudio/uni-app'
const spacingHeight = ref('')
const istance = getCurrentInstance()
onLoad(() => {
    const query:any = uni.createSelectorQuery().in(istance);
    query
    .select(".search-view")
    .boundingClientRect((res:{height:number}) => {
        spacingHeight.value = res.height + 'px'
    })
    .exec();
    })
</script>

<style>
    /* 顶部搜索框 */
    .search-view{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9;
	background-color: #FFFFFF;
}
.search-input{
  height: v-bind('MenuButton().height');
  width: v-bind('MenuButton().left');
}
.search-input input{
  height: v-bind('MenuButton().height');
}
/*  距离和配送范围 */
.merchant-store{
  height: 150rpx;
  font-size: 35rpx;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20rpx;
}
.merchant-store view{
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}
.address-view text{
  padding: 0 10rpx;
}
.address-view text:nth-child(2){
  flex: 1;
}
.address-view image{
  width: 30rpx;
}
.distance-view image{
  width: 27rpx;
}
.distance-view text{
  font-size: 28rpx;
  color: #999999;
  font-weight: initial;
  padding-left: 15rpx;
}
</style>