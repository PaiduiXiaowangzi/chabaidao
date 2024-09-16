<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'类目管理',router:'/category'}]" />
        <div class="content-main">
            <div class="global-display subbuttom"><el-button type="primary" @click="centerDialogVisible = true">新增类目</el-button></div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="categoryName" label="类目"/>
                <el-table-column label="图标">
                    <template #default="scope">
                        <el-image style="width: 40px; height: 40px; border-radius: 5px;" 
                        :src="scope.row.icon" fit="cover" 
                        :preview-src-list="[scope.row.icon]"
                        preview-teleported
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="商品数量" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" size="default" @click="deleteCategory(scope.row._id,scope.row.quantity,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination class="pager-next" background layout="prev, pager, next" :total="total"
        hide-on-single-page
        @current-change="currentChange"
        />
        <!-- 新增类目弹出框 -->
        <el-dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            v-model="centerDialogVisible"
            title="新增类目"
            width="30%"
            align-center>
            <h3>类目</h3>
            <el-input placeholder="请输入类目" v-model="category"/>
            <h3>图标</h3>
            <UploadImg width="100px"/>
            <template #footer>
            <span class="dialog-footer">
                <el-button size="default" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="default" type="primary" @click="okCategory">提交</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
// 顶部导航组件
import Paging from '@/page/component/Paging-component.vue'
// 图片上传
import UploadImg from '@/page/component/upload.vue'
import request from '@/api/request.js'
import {ref,onMounted} from 'vue'
// 存储类目数据
const tableData = ref([])
// 控制弹窗
const centerDialogVisible = ref(false)

// 子组件上传图片成功触发
import emitter from '@/api/event.js'
const icon = ref('')//图标
emitter.on('upload-image-Success', (res) => {
    icon.value = res.url
});
// 新增类目
const category = ref('')
async function okCategory(){
   const res = await request.post('/add-category',{category:category.value,icon:icon.value})
    const obj = {...res.data,...{quantity:0}}
    tableData.value.push(obj)
    centerDialogVisible.value = false
    category.value = ''
    icon.value = ''
    emitter.emit('clear-image');
}
// 获取类目
const page = ref(1)
const total = ref(0)
onMounted(async()=>{
    requestApi()
})
async function requestApi(){
    const res = await request.get('/get-category',{page:page.value})
    console.log(res)
    tableData.value = res.data.categoryData
    total.value = res.data.total
}
// 删除类目
import { ElMessage, ElMessageBox } from 'element-plus'
function deleteCategory(id,num,index){
    ElMessageBox.confirm('确定删除该类目吗?','删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    }
  )
    .then(async() => {
      if(num > 0){
        ElMessage('请先删除类目下的商品')
      }else{
        await request.get('/delete-category',{_id:id})
        tableData.value.splice(index,1)
      }
    })
}
// 分页
async function currentChange(event){
    page.value = event
    requestApi()
}
</script>

<style>
</style>