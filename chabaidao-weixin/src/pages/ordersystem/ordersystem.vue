<template>
  <Toparea :distance="merchantDistance.distance" />
  <view>点单</view>
  <ShoppingCart />
</template>

<script setup lang="ts">
import Toparea from './components/top-area.vue'
import ShoppingCart from './components/shopping-cart.vue'
import{ onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { Distance } from'@/types/ordersystem'
import { request } from '@/api/request'
onLoad(() => {
  locate()
})

// 定位
const locate = () => {
  uni.getLocation({
	type: 'wgs84',
	success: function (res) {
    rangeQuery(res.latitude, res.longitude)
	},
  fail:(fail)=>{
    console.log(fail)
    locationHint()
  }
});
}

// 提醒必须授权定位
const locationHint = () => {
  uni.showModal({
    title: '没有位置权限!',
    content: '请打开位置权限!',
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F',
    success: (result) => {
      if(result.confirm){
        uni.openSetting({
          success(res) {
            if(res.authSetting['scope.userLocation']) {
              locate()
            }else {
              locationHint()
            }
          }
        })
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });
}


// 计算距离
const merchantDistance = ref({distance:''})
const rangeQuery = async (latitude:number, longitude:number) => {
  const res = await request<Distance>('/distance-calculator',{latitude,longitude})
  merchantDistance.value.distance = res.data.distance
}

</script>

<style scoped></style>