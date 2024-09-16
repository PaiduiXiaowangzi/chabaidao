<template>
  <view class="return-view" @click="preVious">
    <view :style="{'height':MenuButton().top}"></view>
    <image src="/static/fanhui.png" mode="heightFix"/>
  </view>

  <block v-for="(item, index) in goodsData" :key="item._id">
    <image :src="item.goods_image" mode="aspectFill"/>
    <view class="product-Info">
        <text>{{ item.goods_name }}</text>
        <text>{{ item.goods_describe }}</text>
    </view>
    <!-- 规格 -->
     <view class="specifications-view" v-for="(item_a,index_a) in item.goods_stats" :key="item_a._id">
        <text class="specifications-title">{{ item_a.name }}</text>
        <view class="select-specifications">
            <button
              v-for="(item_b,index_b) in item_a.subAttributes"
              :key="item_b._id"
              :class="{'selected':item_b._id === item_a.selected}"
              :disabled="item_b.disable"
              @click="selectSpec(item_a, item_b._id, item_b.statesId, item_a._id, item_b.name)"
            >{{ item_b.name }}</button>
        </view>
     </view>
  </block>

  <!-- 加入购物车 -->
    <view class="shopping-cart-area">
        <view class="select-goods price-padd">
            <view class="shopping-price">¥{{ goodsSkuPrice }}</view>
            <view class="select-goods single-goods">
                <image src="/static/jian-goods.png" mode="widthFix" />
                <text ></text>
                <image src="/static/jia-goods.png" mode="widthFix"/>
            </view>
        </view>
        <view class="selected-option">
            <text>
            </text>
        </view>
        <block>
            <button>加入购物车</button>
            <!-- <button >已售罄</button> -->
        </block>
    </view>
    <view style="height: 300rpx;"></view>
</template>


<script setup lang="ts">
import {ref,watch,computed} from 'vue'
import {MenuButton,MerchanInfo} from '@/api/menubutton'
import {onLoad} from '@dcloudio/uni-app'
import type{Category,GoodsSku,GoodsStat} from '@/types/ordersystem'
import { request } from '@/api/request'

// 商品分类id
const parentLevel = ref('')
// 商品id
const sublevel = ref('')
// 商品详细数据
const goodsData = ref<Category[]>([])
// 商品展示价格
const goodsSkuPrice = ref(0)
// 存储该商品的sku列表
const skuListData = ref<GoodsSku[]>([])
// 选中的sku的对象_id
const sku_id = ref('')
// 接受上个页面的数据
onLoad(async(event)=>{
    const res = JSON.parse(event?.goods || "{}") as {theGoods:Category,fatherId:string,sonId:string}
    // console.log(res);
    parentLevel.value = res.fatherId
    sublevel.value = res.sonId
    goodsData.value = [res.theGoods]
    goodsSkuPrice.value = res.theGoods.goods_price
    const skuList = await request<GoodsSku[]>('/goods-sku-list',{_id:res.sonId})
    // console.log(skuList)
    skuListData.value = skuList.data
})

// 定义商品信息类型
interface SkuData{
        _id:string,
        sku:{name:string,statsId:string}
    }
const selectedStats = ref<SkuData[]>([])
// 用户点击分类按钮时逻辑belike

// 形参结构：
// {
//   "name": "颜色",
//   "selected": "001", // 当前选中的子属性 ID（例如红色）
//   "subAttributes": [
//     { "_id": "001", "name": "红色", "disabled": false },
//     { "_id": "002", "name": "蓝色", "disabled": false }
//   ]
// }
const selectSpec = (item_a:GoodsStat, selectedId:string, statsId:string, nameId:string, sonName:string ) => {
    item_a.selected = item_a.selected == selectedId ? '' : selectedId
    let index = selectedStats.value.findIndex(item => item._id === nameId)
    if(item_a.selected) {
        let newSelection = {
            _id: nameId,
            sku: {
                name:sonName,
                statsId
            }
        }
        if(index > -1) {
            selectedStats.value.splice(index,1,newSelection)
        }else {
            selectedStats.value.push(newSelection)
        }
    }else {
        if(index > -1){
            selectedStats.value.splice(index, 1)
        }
    }
}

// 返回页面
const preVious = () => {
    uni.navigateBack({
        delta: 1
    });
}
</script>

<style scoped>
/* 选中属性加上样式 */
.selected {
    background-color: #214bd5 !important;
    color: #ffffff;
}
.return-view{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}
.return-view image{
    height: v-bind('MenuButton().height');
    margin-left: 20rpx;
}
.goods-image{
    width: 100%;
    height: 550rpx;
}
.product-Info text{
    padding: 20rpx 20rpx 0 20rpx;
}
.product-Info text:nth-child(1){
    font-size: 45rpx;
}
.product-Info text:nth-child(2){
    font-size: 25rpx;
    line-height: 1.5;
}
/* 选择规格 */
.specifications-view{
    padding: 35rpx 20rpx 0 20rpx;
}
.specification-title{
    font-size: 28rpx;
    font-weight: bold;
    font-family: serif;
}
.select-specifications{
    display: flex;
    flex-wrap: wrap;
}
.select-specifications button{
    background-color: #ecf0f5;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    font-size: 26rpx;
    margin: 20rpx 20rpx 0 0;
}
/* 底部购物车 */
.shopping-cart-area{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 68rpx;
    border-top: 1rpx solid #f5f5f5;
}
.price-padd{
    padding: 30rpx 20rpx;
}
.shopping-price{
    font-size: 40rpx;
    font-weight: bold;
}
.select-goods{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.single-goods image{
    width: 45rpx;
}
.single-goods text{
    font-size: 26rpx;
    padding: 0 27rpx;
}
.selected-option{
    display: flex;
    flex-wrap: wrap;
    padding: 0 20rpx;
    font-size: 25rpx;
    color: #979797;
}
.selected-option text{
    padding: 0 10rpx 10rpx 0;
}
.shopping-cart-area button{
    margin: 10rpx 20rpx;
    font-size: 30rpx;
    padding: 25rpx 0;
}
</style>