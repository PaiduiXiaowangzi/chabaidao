<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'商品管理',router:'/product'}]" />
        <div class="content-main">
            <div class="global-display subbuttom"><el-button type="primary" @click="subMit">新增商品</el-button></div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="商品图片">
                    <template #default="scope">
                        <el-image style="width: 40px; height: 40px; border-radius: 5px;" 
                        :src="scope.row.goods_image" fit="cover" 
                        :preview-src-list="[scope.row.goods_image]"
                        preview-teleported
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="goods_name" label="商品"/>
                <el-table-column prop="goods_category" label="所属类目"/>
                <el-table-column prop="goods_price" label="价格" />
                <el-table-column prop="goods_stock" label="库存" />
                <el-table-column prop="sales_valume" label="销量" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" size="default" @click="deleteGoods(scope.row._id,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination class="pager-next" background layout="prev, pager, next" :total="total"
        hide-on-single-page
        @current-change="currentChanges"
        />
    </div>
</template>

<script setup>
// 顶部导航组件
import Paging from '@/page/component/Paging-component.vue'
import {ref,onMounted} from 'vue'
import { useRouter } from 'vue-router'
const $router = useRouter()  // 这是路由跳转的
import request from '@/api/request.js'
// 表格数据
const tableData = ref([])
// 跳转新增商品
function subMit(){
    $router.push('/new-goods')
}

const page = ref(1)
const total = ref(0)
// 获取商品
onMounted(()=>{
    requestApi()
})
async function requestApi(){
    const res = await request.get('/get-goods',{page:page.value})
	console.log(res)
    tableData.value = res.data.goodsData
    total.value = res.data.total
}
// 分页
async function currentChanges(event){
    page.value = event
    requestApi()
}
// 删除商品
import { ElMessage, ElMessageBox } from 'element-plus'
function deleteGoods(id,index){
    ElMessageBox.confirm('确定删除该商品吗?','删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    }
  )
    .then(async() => {
        await request.get('/delete-goods',{_id:id})
        tableData.value.splice(index,1)
    })
}
</script>

<style>
</style>