<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'首页推荐',router:''}]" />
        <div class="content-main">
            <div class="global-display subbuttom"><el-button type="primary" @click="subMit">新增推荐</el-button></div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="封面图">
                    <template #default="scope">
                        <el-image style="width: 40px; height: 40px; border-radius: 5px;" 
                        :src="scope.row.carouselImages" fit="cover" 
                        :preview-src-list="[scope.row.carouselImages]"
                        preview-teleported
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="goods_name" label="关联商品"/>
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
    </div>
</template>

<script setup>
    // 顶部导航组件
    import Paging from '@/page/component/Paging-component.vue'
    import {ref,onMounted} from 'vue'
    import { useRouter } from 'vue-router'
    const $router = useRouter()  // 这是路由跳转的
    import request from '@/api/request.js'
    // 跳转新增推荐
    function subMit(){
        $router.push('/NewRecommendation')
    }
    // 轮播图
    const tableData = ref([])
    onMounted(async()=>{
        const res = await request.get('/get-recommend')
		console.log(res)
        tableData.value = res.data
    })
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
            await request.get('/delete-recommend',{_id:id})
            tableData.value.splice(index,1)
        })
    }
</script>

<style>
    .reco-type{
        font-size: 18px;
        font-weight: bold;
    }
</style>