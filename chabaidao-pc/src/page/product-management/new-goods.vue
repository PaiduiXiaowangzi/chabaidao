<template>
<div id="Content-page">
    <Paging :pagData="[{name:'商品管理',router:'/product'},{name:'新增商品',router:'/new-goods'}]" />
    <div class="content-main">
        <div>
            <h4>商品分类</h4>
            <el-select v-model="categoryId" placeholder="请选择分类">
            <el-option
                v-for="item in options"
                :key="item._id"
                :label="item.categoryName"
                :value="item._id"
                />
            </el-select>
        </div>
        <div>
            <h4>商品图片</h4>
            <UploadImg width="100px"/>
        </div>
        <div>
            <h4>商品名称</h4>
            <el-input
                class="new-goods-input"
                size="large"
                v-model="goodsTitle"
                placeholder="填写商品名称"
            />
        </div>
        <div>
            <h4>商品描述</h4>
            <el-input
                class="new-goods-input"
                size="large"
                v-model="goodsDescribe"
                placeholder="填写商品描述"
            />
        </div>
    </div>
    <!-- 商品属性 -->
    <div class="content-main">
        <h4>商品属性(选填)</h4>
        <div class="goods-Stats" v-for="(attr, index) in attributes" :key="index">
            <div class="goods-item-row">
                <p class="stats-title">属性{{ index + 1 }}</p>
                <div>
                    <el-input
                    class="goods-Stats-input"
                    size="large"
                    v-model="attr.name"
                    placeholder="填写属性名称"
                    />
                </div>
                <p class="delet-stats" @click="deleteAttribute(index)">删除属性</p>
            </div>
            <!-- 添加的子属性 -->
            <div class="goods-item-row"  v-for="(subAttr, subIndex) in attr.subAttributes" :key="subIndex">
                <p></p>
                <div>
                    <el-input
                    class="goods-Stats-input"
                    size="large"
                    v-model="subAttr.name"
                    :placeholder="`请输入${attr.name}`"
                    />
                </div>
                <img src="/public/vite.svg" @click="deleteSubAttribute(index, subIndex)">
            </div>
            <!-- 添加子属性按钮 -->
            <div class="goods-item-row">
                <p></p>
                <p class="delet-stats" @click="addSubAttribute(index)">添加子属性</p>
            </div>
        </div>
        <!-- 创建新属性 -->
        <p class="delet-stats" @click="addNewAttribute">创建新属性</p>
    </div>
    <!-- 规格售价与库存 -->
    <div class="content-main">
        <h4>规格售价与库存</h4>
        <div class="new-specification" v-for="(specObj, index) in specificationsData" :key="index">
            <p v-show="specObj.specs.length > 0">{{ specObj.specs.join('，') }}</p>
            <div>
                <el-input
                    class="goods-Stats-input"
                    size="large"
                    type="number"
                    min="1"
                    v-model="specObj.price"
                    placeholder="请输入售卖价格"
                />
                <el-input
                    class="goods-Stats-input"
                    size="large"
                    type="number"
                    min="1"
                    v-model="specObj.stock"
                    placeholder="请输入库存"
                />
            </div>
        </div>
    </div>
    <!-- 提交 -->
    <div class="right-upload-button">
        <el-button type="primary" class="submit-button" :loading="loadingBtn" @click="submitData">提交</el-button>
    </div>
    <div style="height: 300px;"></div>
</div>
</template>

<script setup>
// 顶部导航组件
import Paging from '@/page/component/Paging-component.vue'
// 图片上传
import UploadImg from '@/page/component/upload.vue'
import {ref,computed,watch,onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import request from '@/api/request.js'
import { useRouter } from 'vue-router'
const $router = useRouter()  // 这是路由跳转的

// 选中的分类
const categoryId = ref('')
// 商品分类
const options = ref([])
// 获取商品的所有分类
onMounted(async()=>{
  const res = await request.get('/all-category')
  options.value = res.data
})
// 子组件上传图片成功触发
import emitter from '@/api/event.js'
const goodsImage = ref('')//商品图片
emitter.on('upload-image-Success', (res) => {
  goodsImage.value = res.url
});
// 商品标题
const goodsTitle = ref('')
// 商品描述
const goodsDescribe = ref('')
// 存储生成的商品属性
const attributes = ref([]);

// 删除属性
function deleteAttribute(index) {
  attributes.value.splice(index, 1);
}

// 生成随机数作为skuid
function generateString() {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return new Date().getTime() + result;
}

// 添加子属性
function addSubAttribute(index) {
  attributes.value[index].subAttributes.push({ name: '',statsId:generateString() });
}

// 删除子属性
function deleteSubAttribute(index, subAttrIndex) {
  attributes.value[index].subAttributes.splice(subAttrIndex, 1);
}

// 创建新属性
function addNewAttribute() {
  attributes.value.push({
    name: '',
    subAttributes: []
  });
}

// 生成规格
const generateSpecifications = computed(() => {
  //去除空格
  attributes.value.forEach(item=>{
    item.name = item.name.trim()
    item.subAttributes.forEach(item_a=>{
      item_a.name = item_a.name.trim()
    })
  })

  const specs = [];//存储取出的子属性
  const skuId = []//存储子属性id
  for (const attr of attributes.value) {
    if (attr.subAttributes.length > 0) {
        const subSpecs = attr.subAttributes.map(subAttr => subAttr.name);
		const statsId = attr.subAttributes.map(subAttr => subAttr.statsId);
        specs.push(subSpecs);
		skuId.push(statsId)
    }
  }
  const newArrspecs = cartesianProduct(specs);
  //去除多余空格
  return {
	 skuList: newArrspecs.map(item => item.map(str => str.trim())),
	 skuValueId:cartesianProduct(skuId)
  }
});
// sku列表
const specificationsData = ref([
    {
        specs:[],
		skuId:[],
        price:'',
        stock:''
    }
]);
watch(generateSpecifications, (newSpecs) => {
    specificationsData.value = newSpecs.skuList.map((item, index) => ({
        specs: newSpecs.skuList[index],
        skuId: newSpecs.skuValueId[index],
        price: specificationsData.value[index]?.price || '',
        stock: specificationsData.value[index]?.stock || ''
    }));
});

// 计算笛卡尔积,计算所有可能得规格
function cartesianProduct(arr) {
  return arr.reduce((a, b) =>
    a.map(x => b.map(y => x.concat([y]))
  ).reduce((a, b) => a.concat(b), []), [[]]);
}
// 提交规格，获取规格数据
const loadingBtn = ref(false)
async function submitData(){
    console.log(attributes.value)
    console.log(specificationsData.value); // 输出所有规格数据
    const NE = nemaEmpty(attributes.value);
    console.log('属性空字符串' + NE);
    if(NE){
      ElNotification({
        message: '请完善规格',
        type: 'warning',
      })
      return
    }
    const SL = sonLength(attributes.value)
    console.log('子属性空数组' + SL);
    if(SL){
      ElNotification({
        message: '请完善规格子属性',
        type: 'warning',
      })
      return
    }
    const SE = sonEmpty(attributes.value);
    console.log('子属性空字符串' + SE);
    if(SE){
      ElNotification({
        message: '请完善规格子属性',
        type: 'warning',
      })
      return
    }
    const NR = nameRepeat(attributes.value)
    console.log('属性重复' + NR);
    if(NR){
      ElNotification({
        message: '请完善规格，属性出现重复',
        type: 'warning',
      })
      return
    }
    const SR = sonRepeat(attributes.value);
    console.log('子属性重复' + SR);
    if(SR){
      ElNotification({
        message: '请完善规格，子属性出现重复',
        type: 'warning',
      })
      return
    }
    const ST = priceStock(specificationsData.value)
    console.log('价格和库存' + ST)
    if(ST){
      ElNotification({
        message: '请完善价格和库存',
        type: 'warning',
      })
      return
    }
    console.log('通过')
    // 提交到接口
    try {
      loadingBtn.value = true
      await request.post('/add-goods',{
        category_id:categoryId.value,
        goods_image:goodsImage.value,
        goods_name:goodsTitle.value,
        goods_describe:goodsDescribe.value,
        goods_stats:attributes.value,
        goods_sku:specificationsData.value
      })
      loadingBtn.value = false
      $router.push('/product')
    } catch (error) {
      loadingBtn.value = false
    }
}

// 判断属性是否出现空字符串
function nemaEmpty(arr) {
  for (const item of arr) {
    if (item.name === "") {
      return true; // 有空字符串的name属性
    }
  }
  return false;
}
// 判断子属性是否空数组
function sonLength(arr){
    for (const item of arr) {
    if (item.subAttributes.length === 0) {
      return true; // 有空数组
    }
  }
  return false;
}
// 判断子属性是否出现空字符串
function sonEmpty(arr) {
  for (const item of arr) {
    for (const subAttr of item.subAttributes) {
      if (subAttr.name === "") {
        return true; // 有空字符串的subAttributes中的name属性
      }
    }
  }
  return false;
}

// 判断属性是否重复
function nameRepeat(arr) {
  const nameSet = new Set();
  for (const item of arr) {
    if (nameSet.has(item.name)) {
      return true; // 有重复的name属性
    }
    nameSet.add(item.name);
  }
  return false;
}
// 判断子属性是否重复
function sonRepeat(arr) {
  for (const item of arr) {
    const subAttrNames = new Set();
    for (const subAttr of item.subAttributes) {
      if (subAttrNames.has(subAttr.name)) {
        return true; // 有重复的subAttributes中的name属性
      }
      subAttrNames.add(subAttr.name);
    }
  }
  return false;
}

// 判断价格和库存是否填写
function priceStock(arr){
  for (const item of arr) {
    if(item.price === "" || item.stock === ""){
      return true
    }
  }
  return false
}

</script>

<style>
    .new-goods-input{
        width: 400px;
    }
    .goods-Stats{
        background-color: #F9F9F9;
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 24px;
    }
    .goods-Stats-input{
        width: 300px;
        margin-right: 20px;
    }
    .goods-item-row{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .goods-item-row p:nth-child(1){
        width: 50px;
    }
    .goods-item-row img{
        width: 20px;
        height: 20px;
    }
    .stats-title{
        font-weight: bold;
        color: blue;
    }
    .delet-stats{
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #576B95;
        cursor: pointer;
        display: inline-block;
    }
    .new-specification{
        padding-bottom: 30px;
    }
    .new-specification:last-child{
        padding: 0;
    }
    .new-specification p{
        margin-bottom: 10px;
    }
</style>