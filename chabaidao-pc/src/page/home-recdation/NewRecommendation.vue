<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'首页推荐',router:'/home'},{name:'新增推荐',router:''}]" />
        <div class="content-main">
            <div>
                <h4>封面图</h4>
                <UploadImg width="200px"/>
            </div>
            <div v-if="tableSelect.length > 0">
                <h4>已选择商品</h4>
                <el-table :data="tableSelect" style="width: 100%">
                    <el-table-column prop="goods_name" label="商品" />
                    <el-table-column prop="goods_price" label="售价" />
                    <el-table-column prop="sales_valume" label="销量" />
                    <el-table-column prop="goods_category" label="所属分类" />
                </el-table>
            </div>
            <h4>选择关联商品</h4>
            <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
                <el-table-column prop="goods_name" label="商品" />
                <el-table-column prop="goods_price" label="售价" />
                <el-table-column prop="sales_valume" label="销量" />
                <el-table-column prop="goods_category" label="所属分类" />
            </el-table>
        </div>
        <el-pagination class="pager-next" background layout="prev, pager, next" :total="total"
        hide-on-single-page
        @current-change="currentChange"
        />
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
    import { useRouter } from 'vue-router'
    const $router = useRouter()  // 这是路由跳转的
    import request from '@/api/request.js'
    // 选中商品
    const tableSelect = ref([])
    // 所有商品
    const tableData = ref([])
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
    async function currentChange(event){
        page.value = event
        requestApi()
    }
    // 子组件上传图片成功触发
    import emitter from '@/api/event.js'
    const swiperImage = ref('')//封面图
    emitter.on('upload-image-Success', (res) => {
        swiperImage.value = res.url
    });
    // 存储选中的商品分类id和商品id
    const goodsId = ref('')
	const categoryId = ref('')
    // 选择商品
    function handleCurrentChange(val){
        tableSelect.value = [val]
		categoryId.value = val.category_id
        goodsId.value = val._id
    }
    // 提交
    const loadingBtn = ref(false)
    async function submitData(){
        loadingBtn.value = true
        try {
            await request.post('/add-recommend',{
                carouselImages:swiperImage.value,
				categoryId:categoryId.value,
                goodsId:goodsId.value
            })
            loadingBtn.value = false
            $router.push('/home')
        } catch (error) {
            console.log(error)
            loadingBtn.value = false
        }
    }
</script>