<template>
  <!-- 顶部搜索栏等等 -->
  <Toparea :distance="merchantDistance.distance" />
  <!-- 左边的滑动栏 -->
  <scroll-view scroll-y class="scroll-height-left" enhanced enable-passive :show-scrollbar="false">
    <view class="left-goods" :class="{activeStyle: index === dynamiIndex}" v-for="(item, index) in allGoods" :key="item._id" @click="anchorConnection(item._id,index)">
      <image
        :src="item.icon"
        mode="widthFix"
      />
      <text>{{ item.categoryName }}</text>
    </view>
  </scroll-view>

  <!-- 右边的滑动栏 -->
  <scroll-view scroll-y enhanced enable-passive :show-scrollbar="false" class="scroll-height-right" :scroll-into-view="subElementId" @scroll="scrollHeight">
    <view class="item-goods" v-for="(item, index) in allGoods" :key="item._id" :id="`A${item._id}`" >
      <text class="category-title">{{ item.categoryName }}</text>
      <view class="goods-infor" v-for="(item_a, index_a) in item.category" :key="item_a._id" @click="selectGoods(index, index_a, item._id, item_a._id)">
        <image :src="item_a.goods_image" mode="aspectFill"/>
        <view class="product-name">
          <text class="goods-name">{{ item_a.goods_name }}</text>
          <text class="goods-intro">{{ item_a.goods_describe }}</text>
          <view class="select-goods">
            <view class="goods-price">
              <text>￥{{ item_a.goods_price }}</text>
              <text>起</text>
            </view>
            <block v-if="item_a.goods_stock > 0">
              <view class="select-quantity" v-if="item_a.goods_stats.length > 0">
                <button>选规格</button>
                <text v-if="item_a.quantity > 0">{{ item_a.quantity }}</text>
              </view>
              <view v-else class="select-goods single-goods">
                <image src="/static/jian-goods.png" mode="widthFix"  @click.stop="addSingleProduct(index,index_a,item._id,item_a._id,'001')"/>
                <text v-if="item_a.quantity > 0">{{ item_a.quantity }}</text>
                <image src="/static/jia-goods.png" mode="widthFix" @click.stop="addSingleProduct(index,index_a,item._id,item_a._id,'002')" />
              </view>
            </block>
            <view v-else>
              <button disabled>已售罄</button>
            </view>
          </view>
          </view>
        </view>
      </view>
  </scroll-view>
  <!-- 购物车组件 -->
  <ShoppingCart />
</template>

<script setup lang="ts">
import Toparea from './components/top-area.vue'
import ShoppingCart from './components/shopping-cart.vue'
import{ onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { Distance, AllGoods } from'@/types/ordersystem'
import { request } from '@/api/request'
import type {CartItem} from '@/types/cart'
import { getCartStatus } from '@/store/index'
import {watch} from 'vue'
onLoad(() => {
  locate()
  allGoodsData()
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

  // 获取所有分类和商品
  const allGoods = ref<AllGoods[]>([])
  async function allGoodsData(){
    try {
      const res = await request<AllGoods[]>('/all-goods')
      // console.log(res)
      allGoods.value = res.data
      setTimeout(() => {
        itemGoodsHeight()
      }, 200);
    } catch (error) {
      console.log(error)
    }
  }

  // 计算右边的高度
  const itemHeight = ref<number[]>([])
  const itemGoodsHeight = () => {
  let totalHeight = 0
  const query = uni.createSelectorQuery()
  query.selectAll('.item-goods').boundingClientRect()
  query.exec((heightData:{height:number}[][]) => {
    heightData[0].forEach(item => {
      totalHeight += item.height
      itemHeight.value.push(totalHeight)
    })
  })

  }
  // 点击左边分类滚动右边
  const dynamiIndex = ref(0)
  const subElementId = ref('')

  const anchorConnection = (id:string, index:number) => {
    dynamiIndex.value = index
    subElementId.value = `A${id}`
    // console.log(itemHeight.value)
    setTimeout(() => {
      subElementId.value = ''
    }, 200);
  }

  // 滚动右边控制左边
  const  scrollHeight = (event:{detail:{scrollTop:number}}) => {
    // console.log(itemHeight.value)
      const scrollTop = event.detail.scrollTop
      if(scrollTop >= itemHeight.value[dynamiIndex.value]){
        dynamiIndex.value += 1
      }else if(scrollTop < itemHeight.value[dynamiIndex.value - 1]){
        dynamiIndex.value -= 1
      }
    }

    // 点击跳转到商品详情页
    function selectGoods(index:number,index_a:number,fatherId:string,sonId:string){
      const theGoods = allGoods.value[index].category[index_a]
      const str = JSON.stringify({theGoods,fatherId,sonId})
      uni.navigateTo({
        url:'/pages/specifications/specifications?goods=' + str
      })
    }

    // 首页添加商品到购物车
    const addSingleProduct = (index:number,index_a:number,fatherId:string,sonId:string,type:string) =>{
      if(type == '001' && allGoods.value[index].category[index_a].quantity > 0){
        allGoods.value[index].category[index_a].quantity--
      }else{
        allGoods.value[index].category[index_a].quantity++
      }
      const theGoods = allGoods.value[index].category[index_a]
      const item:CartItem = {
          fatherId,
          sonId,
          goods_name:theGoods.goods_name,
          goods_image:theGoods.goods_image,
          goods_id:theGoods._id,
          goodsPrice:theGoods.goods_price,
          goodsQuantity:theGoods.quantity,
          totalPrice:0,
          sku:[],
          skuIdArr:[],
          sku_id:'',
          homePage:true
      }
      getCartStatus().addCart(item)
    }


    const cartStore = getCartStatus()

    // 监听商品数量变化，保证cartSrore和allGoods数量一致
    watch(() =>cartStore.cartItems.map(item => item.goodsQuantity),
    (newVal,oldVal) => {
      for(let i = 0; i < newVal.length; i++) {
        if(newVal[i] !== oldVal[i]) {
          var changedItem = cartStore.cartItems[i]
        }
      }
      if(cartStore.cartItems.length <= 0) return
        let goodsQuantity = 0
        let fatherId = ''
        let sonId = ''
        cartStore.cartItems.forEach(item => {
          if(changedItem && item.goods_id === changedItem.goods_id) {
            goodsQuantity = item.goodsQuantity
            fatherId = item.fatherId
            sonId = item.sonId
          }
        })
        let parentIndex = allGoods.value.findIndex(item => item._id === fatherId);
        if (parentIndex >= 0) {
          const category = allGoods.value[parentIndex].category;
          const childIndex = category.findIndex(item => item._id === sonId);
          if (childIndex >= 0 && allGoods.value[parentIndex].category[childIndex].quantity !== goodsQuantity) {
            allGoods.value[parentIndex].category[childIndex].quantity = goodsQuantity;
          }
        }
      })
    // 监听清空购物车，将allGoods里的商品清零
    watch(() => cartStore.cartItems, (newVal) => {
      // 防止重复触发更新
      if (newVal.length <= 0 && allGoods.value.some(item => item.category.some(item_a => item_a.quantity > 0))) {
        allGoods.value.forEach(item => {
          item.category.forEach(item_a => {
            if (item_a.quantity > 0) {
              item_a.quantity = 0
            }
          })
        })
      }
    })

    import { pageGoodsId } from '@/store/index'
    // 监听此页面是否为首页轮播图跳转而来，如果是，再次跳转到商品详情
    watch([() => pageGoodsId().goodsId,allGoods,allGoods],([goodsId,goods]) => {
      if(goodsId.length > 0 && goods.length > 0) {
        const parentIndex = allGoods.value.findIndex(item => item._id === goodsId[0].categoryId)
        if(parentIndex >= 0) {
          const category = allGoods.value[parentIndex].category
          const childIndex = category.findIndex(item => item._id === goodsId[0].goodsId)
          selectGoods(parentIndex, childIndex, goodsId[0].categoryId, goodsId[0].goodsId)
        }
      }
    },{deep:true})

</script>

<style >
    /* 点餐区域 */
    .order-menu{
  display: flex;
}
/* 左边商品分类滚动 */
.scroll-height-left{
  height: 100vh;
  width: 175rpx;
  background-color: #f8f8f8;
  position: fixed;
  left: 0;
}
.left-goods{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 25rpx;
  padding: 15rpx 0;
}
.left-goods image{
  width: 65rpx;
}
.left-goods title{
  padding-top: 10rpx;
  color: #777777;
}
.activeStyle{
  background-color: antiquewhite;
}
/* 右边商品 */
.scroll-height-right{
  flex: 1;
  padding: 0 20rpx;
  height: 100vh;
  position: fixed;
  right: 0;
  left: 175rpx;
  width: auto;
}
.item-goods{
  padding-top: 35rpx;
}
.category-title{
  font-weight: bold;
}
.goods-infor{
  display: flex;
  align-items: center;
  padding-top: 35rpx;
}
.goods-infor image{
  width: 170rpx;
  height: 170rpx;
  border-radius: 15rpx;
}
.product-name{
  flex: 1;
  padding-left: 15rpx;
}
.goods-name{
  font-weight: bold;
  font-size: 29rpx;
}
.goods-intro{
  line-height: 1.4;
  color: #b8b8b8;
  font-size: 25rpx;
  margin: 13rpx 0;
}
.select-goods{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-price{
  display: flex;
  flex: 1;
}
.goods-price text:nth-child(1){
  font-size: 30rpx;
  font-weight: bold;
  padding-right: 10rpx;
}
.goods-price text:nth-child(2){
  font-size: 24rpx;
  color: #b8b8b8;
  align-self: flex-end;
}
.select-quantity{
  position: relative;
}
.select-quantity button{
  font-size: 28rpx;
  line-height: inherit;
  background-color: #214bd5;
  color: #ffffff;
  padding: 5rpx 20rpx;
  border-radius: 40rpx;
}
.select-quantity text{
  position: absolute;
  top: -7rpx;
  right: 0;
  background: bisque;
  border-radius: 50%;
  width: 30rpx;
  height: 30rpx;
  font-size: 18rpx;
  text-align: center;
  line-height: 30rpx;
}
.single-goods image{
  width: 45rpx;
}
.single-goods text{
  font-size: 26rpx;
  width: 63rpx;
  text-align: center;
}
</style>